#!/bin/bash

# Synapse Chrome Extension Landing Page - Netlify Deployment Script
# This script automates the setup and deployment process for the Synapse Chrome extension landing page

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to validate Node.js version
validate_node_version() {
    if command_exists node; then
        NODE_VERSION=$(node --version)
        print_status "Node.js version: $NODE_VERSION"
        
        # Extract major version number
        NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
        if [ "$NODE_MAJOR" -lt 18 ]; then
            print_error "Node.js version 18 or higher is required. Current version: $NODE_VERSION"
            print_error "Please update Node.js: https://nodejs.org/"
            exit 1
        fi
    else
        print_error "Node.js not found. Please install Node.js 18 or higher."
        print_error "Download from: https://nodejs.org/"
        exit 1
    fi
}

# Function to install dependencies
install_dependencies() {
    print_status "Installing project dependencies..."
    
    if command_exists npm; then
        npm ci --silent
    elif command_exists yarn; then
        yarn install --frozen-lockfile --silent
    else
        print_error "Neither npm nor yarn found. Please install Node.js and npm."
        exit 1
    fi
    
    print_success "Dependencies installed successfully"
}

# Function to build the project
build_project() {
    print_status "Building the project for production..."
    
    # Set environment variables for production build
    export NODE_ENV=production
    export NEXT_TELEMETRY_DISABLED=1
    
    if command_exists npm; then
        npm run build
    elif command_exists yarn; then
        yarn build
    fi
    
    print_success "Project built successfully"
}

# Function to setup Netlify configuration
setup_netlify_config() {
    print_status "Setting up Netlify configuration..."
    
    # Create netlify.toml if it doesn't exist
    if [ ! -f "netlify.toml" ]; then
        cat > netlify.toml << 'EOF'
[build]
  publish = "out"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "9"
  NEXT_TELEMETRY_DISABLED = "1"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[dev]
  command = "npm run dev"
  port = 3000

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self';"

[[headers]]
  for = "*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "*.webp"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "*.png"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "*.svg"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
EOF
        print_success "Created netlify.toml configuration file"
    else
        print_warning "netlify.toml already exists, skipping creation"
    fi
    
    # Create _redirects file for client-side routing
    if [ ! -f "public/_redirects" ]; then
        mkdir -p public
        echo "/*    /index.html   200" > public/_redirects
        print_success "Created _redirects file for client-side routing"
    fi
}

# Function to optimize for production
optimize_production() {
    print_status "Optimizing for production deployment..."
    
    # Create robots.txt
    if [ ! -f "public/robots.txt" ]; then
        cat > public/robots.txt << EOF
User-agent: *
Allow: /

Sitemap: https://synapse-extension.netlify.app/sitemap.xml
EOF
        print_success "Created robots.txt"
    fi
    
    # Create sitemap.xml
    if [ ! -f "public/sitemap.xml" ]; then
        cat > public/sitemap.xml << EOF
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://synapse-extension.netlify.app/</loc>
    <lastmod>$(date +%Y-%m-%d)</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
EOF
        print_success "Created sitemap.xml"
    fi
    
    # Create manifest.json for PWA
    if [ ! -f "public/manifest.json" ]; then
        cat > public/manifest.json << EOF
{
  "name": "Synapse - Cognitive Learning Acceleration Chrome Extension",
  "short_name": "Synapse",
  "description": "A Chrome extension that adapts to your cognitive patterns for enhanced learning",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3b82f6",
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
EOF
        print_success "Created PWA manifest.json"
    fi

    # Create placeholder icons for Chrome Web Store
    if [ ! -d "public/icons" ]; then
      mkdir -p public/icons
      print_status "Created icons directory"
    fi

    # Create basic icon files (these would be replaced with actual generated icons)
    icon_sizes=("16x16" "32x32" "48x48" "128x128" "192x192" "512x512")
    for size in "${icon_sizes[@]}"; do
      if [ ! -f "public/icons/icon-${size}.png" ]; then
        # Create placeholder - in production, these would be actual generated icons
        touch "public/icons/icon-${size}.png"
      fi
    done
    print_success "Icon placeholders created"
}

# Function to run linting
run_linting() {
    if [ -f "package.json" ] && grep -q '"lint"' package.json; then
        print_status "Running code linting..."
        if command_exists npm; then
            npm run lint --silent || print_warning "Linting completed with warnings"
        elif command_exists yarn; then
            yarn lint --silent || print_warning "Linting completed with warnings"
        fi
        print_success "Linting completed"
    else
        print_warning "No linting script found, skipping"
    fi
}

# Function to validate build output
validate_build() {
    print_status "Validating build output..."
    
    if [ ! -d "out" ]; then
        print_error "Build output directory 'out' not found"
        exit 1
    fi
    
    if [ ! -f "out/index.html" ]; then
        print_error "index.html not found in build output"
        exit 1
    fi
    
    # Check if essential files exist
    essential_files=("out/index.html")
    for file in "${essential_files[@]}"; do
        if [ ! -f "$file" ]; then
            print_error "Essential file $file not found"
            exit 1
        fi
    done
    
    # Check if images directory exists
    if [ ! -d "out/images" ]; then
        print_warning "Images directory not found in build output"
    fi
    
    print_success "Build validation completed successfully"
}

# Function to setup environment variables
setup_environment() {
    print_status "Setting up environment variables..."
    
    # Create .env.example if it doesn't exist
    if [ ! -f ".env.example" ]; then
        cat > .env.example << EOF
# Synapse Chrome Extension Landing Page Environment Variables
# Copy this file to .env.local and fill in your values

# Analytics (optional)
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=

# API Endpoints (if needed)
NEXT_PUBLIC_API_URL=

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_CONTACT_FORM=false

# Build Configuration
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1

# Chrome Web Store
NEXT_PUBLIC_CHROME_STORE_URL=
EOF
        print_success "Created .env.example file"
    fi
    
    # Check if .env.local exists
    if [ ! -f ".env.local" ]; then
        print_warning ".env.local not found. Using default environment variables."
        print_warning "Copy .env.example to .env.local and configure as needed."
    fi
}

# Function to clean previous builds
clean_build() {
    print_status "Cleaning previous build artifacts..."
    
    # Remove build directories
    rm -rf out
    rm -rf .next
    rm -rf dist
    rm -rf node_modules/.cache
    
    print_success "Build artifacts cleaned"
}

# Function to check project structure
check_project_structure() {
    print_status "Checking project structure..."
    
    required_files=("package.json" "next.config.mjs" "tailwind.config.ts")
    for file in "${required_files[@]}"; do
        if [ ! -f "$file" ]; then
            print_error "Required file $file not found"
            exit 1
        fi
    done
    
    required_dirs=("app" "public")
    for dir in "${required_dirs[@]}"; do
        if [ ! -d "$dir" ]; then
            print_error "Required directory $dir not found"
            exit 1
        fi
    done
    
    print_success "Project structure validation completed"
}

# Function to display deployment information
display_deployment_info() {
    print_success "🎉 Deployment preparation completed successfully!"
    echo ""
    echo "📋 Deployment Summary:"
    echo "  • Project: Synapse Chrome Extension Landing Page"
    echo "  • Build output: ./out directory"
    echo "  • Netlify config: netlify.toml"
    echo "  • Redirects: public/_redirects"
    echo "  • SEO files: robots.txt, sitemap.xml"
    echo "  • PWA manifest: manifest.json"
    echo ""
    echo "🚀 Next Steps for Netlify Deployment:"
    echo "  1. Push your code to GitHub/GitLab"
    echo "  2. Connect repository to Netlify (https://app.netlify.com/)"
    echo "  3. Netlify will auto-detect settings from netlify.toml"
    echo "  4. Deploy and get your live URL!"
    echo ""
    echo "⚙️  Manual Netlify Settings (if needed):"
    echo "  • Build command: npm run build"
    echo "  • Publish directory: out"
    echo "  • Node version: 18"
    echo ""
    echo "🔗 Useful Resources:"
    echo "  • Netlify Dashboard: https://app.netlify.com/"
    echo "  • Deployment Docs: https://docs.netlify.com/"
    echo "  • Next.js Static Export: https://nextjs.org/docs/app/building-your-application/deploying/static-exports"
    echo ""
}

# Main deployment function
main() {
    echo "🧠 Synapse Chrome Extension Landing Page"
    echo "========================================"
    echo "Netlify Deployment Setup & Build Script"
    echo ""
    
    # Check if we're in the right directory
    if [ ! -f "package.json" ]; then
        print_error "package.json not found. Please run this script from the project root directory."
        exit 1
    fi
    
    # Run all deployment steps
    check_project_structure
    validate_node_version
    setup_environment
    clean_build
    install_dependencies
    setup_netlify_config
    optimize_production
    run_linting
    build_project
    validate_build
    display_deployment_info
}

# Handle script arguments
case "${1:-}" in
    "clean")
        clean_build
        ;;
    "build")
        validate_node_version
        install_dependencies
        build_project
        validate_build
        ;;
    "setup")
        setup_netlify_config
        optimize_production
        ;;
    "install")
        validate_node_version
        install_dependencies
        ;;
    "help"|"-h"|"--help")
        echo "Synapse Chrome Extension Landing Page Deployment Script"
        echo ""
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  (no args)  Run full deployment setup and build"
        echo "  clean      Clean build artifacts only"
        echo "  build      Install dependencies and build project"
        echo "  setup      Setup Netlify configuration only"
        echo "  install    Install dependencies only"
        echo "  help       Show this help message"
        echo ""
        echo "Examples:"
        echo "  $0              # Full deployment preparation"
        echo "  $0 clean        # Clean previous builds"
        echo "  $0 build        # Quick build for testing"
        echo ""
        ;;
    *)
        main
        ;;
esac
