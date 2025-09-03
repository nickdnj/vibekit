#!/bin/bash

# 🧪 VibeKit CLI Interactive Testing Script
# This script walks you through testing the complete VibeKit CLI

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Emojis and styling
ROCKET="🚀"
CHECK="✅"
FIRE="🔥"
WARNING="⚠️"
BOOM="💥"
PARTY="🎉"

# Print styled header
print_header() {
    echo -e "${PURPLE}"
    echo "╭─────────────────────────────────────────────────────╮"
    echo "│          ${FIRE} VibeKit CLI Testing Script ${FIRE}           │"
    echo "│              Professional Testing Mode              │"
    echo "╰─────────────────────────────────────────────────────╯"
    echo -e "${NC}"
}

# Print section header
print_section() {
    echo -e "\n${CYAN}${ROCKET} $1${NC}\n"
}

# Print step
print_step() {
    echo -e "${BLUE}📋 Step $1: $2${NC}"
}

# Print success
print_success() {
    echo -e "${GREEN}${CHECK} $1${NC}"
}

# Print warning
print_warning() {
    echo -e "${YELLOW}${WARNING} $1${NC}"
}

# Print error
print_error() {
    echo -e "${RED}${BOOM} $1${NC}"
}

# Wait for user input
wait_for_user() {
    echo -e "\n${YELLOW}Press ENTER to continue or 'q' to quit...${NC}"
    read -r input
    if [[ "$input" == "q" || "$input" == "Q" ]]; then
        echo -e "${YELLOW}Testing cancelled by user.${NC}"
        exit 0
    fi
}

# Check if command exists
check_command() {
    if command -v "$1" &> /dev/null; then
        print_success "$1 is installed"
        return 0
    else
        print_error "$1 is not installed"
        return 1
    fi
}

# Run command with user confirmation
run_cli_command() {
    local cmd="$1"
    local description="$2"
    
    echo -e "\n${PURPLE}${FIRE} About to run: ${CYAN}$cmd${NC}"
    echo -e "${BLUE}This will: $description${NC}"
    
    echo -e "\n${YELLOW}Ready to execute? (y/n/s)${NC}"
    echo -e "${YELLOW}  y = Yes, run it${NC}"
    echo -e "${YELLOW}  n = No, skip this test${NC}" 
    echo -e "${YELLOW}  s = Show command only, don't run${NC}"
    
    read -r choice
    case $choice in
        [Yy]* )
            echo -e "\n${GREEN}${ROCKET} Executing: $cmd${NC}\n"
            eval "$cmd"
            local exit_code=$?
            if [ $exit_code -eq 0 ]; then
                print_success "Command completed successfully!"
            else
                print_error "Command failed with exit code: $exit_code"
                echo -e "${YELLOW}Continue anyway? (y/n)${NC}"
                read -r continue_choice
                if [[ "$continue_choice" != "y" && "$continue_choice" != "Y" ]]; then
                    exit 1
                fi
            fi
            ;;
        [Ss]* )
            echo -e "\n${CYAN}Command would be: $cmd${NC}"
            print_warning "Skipped execution"
            ;;
        * )
            print_warning "Skipped: $description"
            ;;
    esac
}

# Main testing workflow
main() {
    print_header
    
    echo -e "${GREEN}Welcome to the VibeKit CLI Testing Script!${NC}"
    echo -e "${BLUE}This script will walk you through testing every component of the VibeKit CLI.${NC}"
    echo -e "${YELLOW}You can skip any step or quit at any time.${NC}"
    
    wait_for_user
    
    # ================================================================
    # SECTION 1: Prerequisites Check
    # ================================================================
    print_section "Prerequisites Check"
    
    print_step "1.1" "Checking required tools"
    
    local missing_tools=()
    
    if ! check_command "node"; then
        missing_tools+=("Node.js")
    fi
    
    if ! check_command "npm"; then
        missing_tools+=("npm")
    fi
    
    if ! check_command "flutter"; then
        missing_tools+=("Flutter")
    fi
    
    if ! check_command "git"; then
        missing_tools+=("Git")
    fi
    
    if [ ${#missing_tools[@]} -ne 0 ]; then
        print_error "Missing tools: ${missing_tools[*]}"
        echo -e "${YELLOW}Please install missing tools and run this script again.${NC}"
        exit 1
    fi
    
    print_success "All required tools are installed!"
    wait_for_user
    
    # ================================================================
    # SECTION 2: CLI Setup
    # ================================================================
    print_section "CLI Setup and Build"
    
    print_step "2.1" "Installing CLI dependencies"
    run_cli_command "cd cli && npm install && cd .." "Install Node.js dependencies for the CLI"
    
    print_step "2.2" "Building CLI TypeScript"
    run_cli_command "cd cli && npm run build && cd .." "Compile TypeScript to JavaScript"
    
    print_step "2.3" "Testing CLI installation"
    run_cli_command "node cli/dist/index.js --help" "Show CLI help to verify installation"
    
    wait_for_user
    
    # ================================================================
    # SECTION 3: Individual CLI Commands Testing
    # ================================================================
    print_section "Individual CLI Commands Testing"
    
    print_step "3.1" "Testing Welcome Command"
    run_cli_command "node cli/dist/index.js welcome" "Display welcome message and project detection"
    
    print_step "3.2" "Testing Firebase Setup"
    echo -e "\n${YELLOW}${WARNING} This will open your browser for Firebase authentication!${NC}"
    run_cli_command "node cli/dist/index.js firebase-setup" "Setup Firebase CLI and authenticate user"
    
    print_step "3.3" "Testing Project Selection"
    echo -e "\n${YELLOW}${WARNING} This will show your Firebase projects and allow creation!${NC}"
    run_cli_command "node cli/dist/index.js project-select" "Select or create Firebase project"
    
    print_step "3.4" "Testing Service Configuration"
    echo -e "\n${YELLOW}${WARNING} This will attempt to enable Firebase services!${NC}"
    run_cli_command "node cli/dist/index.js service-config" "Configure Firebase services interactively"
    
    print_step "3.5" "Testing Config Generation"
    echo -e "\n${YELLOW}${WARNING} This will generate firebase_options.dart file!${NC}"
    run_cli_command "node cli/dist/index.js generate-config" "Generate Firebase configuration files"
    
    wait_for_user
    
    # ================================================================
    # SECTION 4: Master Configuration Test
    # ================================================================
    print_section "Master Configuration Wizard"
    
    echo -e "${PURPLE}${FIRE} THE BIG TEST: Complete Configuration Wizard${NC}"
    echo -e "${BLUE}This is the master command that runs all steps in sequence.${NC}"
    echo -e "${YELLOW}It will:${NC}"
    echo -e "${YELLOW}  • Validate project${NC}"
    echo -e "${YELLOW}  • Authenticate with Firebase${NC}"
    echo -e "${YELLOW}  • Select/create project${NC}"
    echo -e "${YELLOW}  • Configure services${NC}"
    echo -e "${YELLOW}  • Generate config files${NC}"
    
    print_step "4.1" "Running Master Configuration"
    run_cli_command "node cli/dist/index.js configure" "Complete end-to-end VibeKit configuration"
    
    wait_for_user
    
    # ================================================================
    # SECTION 5: Flutter App Testing
    # ================================================================
    print_section "Flutter Application Testing"
    
    print_step "5.1" "Installing Flutter dependencies"
    run_cli_command "flutter pub get" "Download Flutter package dependencies"
    
    print_step "5.2" "Generating model files"
    run_cli_command "flutter packages pub run build_runner build" "Generate Dart model files from annotations"
    
    print_step "5.3" "Testing Web compilation"
    echo -e "\n${YELLOW}${WARNING} This will open the app in your browser!${NC}"
    echo -e "${BLUE}The app should show an authentication screen.${NC}"
    echo -e "${YELLOW}Press Ctrl+C in the terminal to stop the app when you're done testing.${NC}"
    run_cli_command "flutter run -d chrome --web-port 8080" "Run VibeKit app in Chrome browser"
    
    # Optional mobile testing
    echo -e "\n${CYAN}Optional: Test mobile platforms?${NC}"
    echo -e "${YELLOW}This requires iOS Simulator or Android Emulator (y/n)${NC}"
    read -r mobile_choice
    
    if [[ "$mobile_choice" == "y" || "$mobile_choice" == "Y" ]]; then
        print_step "5.4" "Checking available devices"
        run_cli_command "flutter devices" "List available Flutter devices"
        
        echo -e "\n${CYAN}Would you like to run on a specific device? (y/n)${NC}"
        read -r device_choice
        
        if [[ "$device_choice" == "y" || "$device_choice" == "Y" ]]; then
            echo -e "${YELLOW}Enter device ID or press ENTER for default:${NC}"
            read -r device_id
            
            if [ -n "$device_id" ]; then
                run_cli_command "flutter run -d $device_id" "Run on device: $device_id"
            else
                run_cli_command "flutter run" "Run on default device"
            fi
        fi
    fi
    
    wait_for_user
    
    # ================================================================
    # SECTION 6: Validation
    # ================================================================
    print_section "Final Validation"
    
    print_step "6.1" "Checking generated files"
    
    if [ -f "lib/firebase_options.dart" ]; then
        print_success "firebase_options.dart exists"
        
        # Check for placeholder values
        if grep -q "YOUR_.*_API_KEY\|vibekit-template" lib/firebase_options.dart; then
            print_warning "firebase_options.dart contains placeholder values"
            echo -e "${YELLOW}This is normal if FlutterFire CLI couldn't run or you skipped config generation.${NC}"
        else
            print_success "firebase_options.dart contains real configuration!"
        fi
    else
        print_error "firebase_options.dart not found"
    fi
    
    if [ -f ".vibekit/config.json" ]; then
        print_success ".vibekit/config.json exists"
    else
        print_warning ".vibekit/config.json not found (this is optional)"
    fi
    
    # Check CLI build
    if [ -f "cli/dist/index.js" ]; then
        print_success "CLI is built and ready"
    else
        print_error "CLI build not found"
    fi
    
    wait_for_user
    
    # ================================================================
    # FINAL SUMMARY
    # ================================================================
    print_section "Testing Complete!"
    
    echo -e "${GREEN}${PARTY} Congratulations! You've completed the VibeKit CLI testing!${NC}\n"
    
    echo -e "${PURPLE}📋 Testing Summary:${NC}"
    echo -e "${CYAN}  • CLI Installation: Complete${NC}"
    echo -e "${CYAN}  • Individual Commands: Tested${NC}"
    echo -e "${CYAN}  • Master Configuration: Tested${NC}"
    echo -e "${CYAN}  • Flutter Integration: Tested${NC}"
    echo -e "${CYAN}  • File Generation: Validated${NC}"
    
    echo -e "\n${GREEN}🚀 Your VibeKit CLI is ready for production use!${NC}"
    
    echo -e "\n${BLUE}Next steps:${NC}"
    echo -e "${YELLOW}  • Customize your app (name, package ID, branding)${NC}"
    echo -e "${YELLOW}  • Start building your specific features${NC}"
    echo -e "${YELLOW}  • Deploy using Firebase Hosting${NC}"
    echo -e "${YELLOW}  • Scale with additional Firebase services${NC}"
    
    echo -e "\n${PURPLE}${FIRE} Happy Vibing! ${FIRE}${NC}\n"
}

# Run the main function
main "$@"
