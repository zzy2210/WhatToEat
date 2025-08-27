#!/bin/bash

# WhatToEat 多平台编译脚本
# 支持 Linux、Windows、macOS、Android

echo "🍽️ WhatToEat 多平台编译脚本"
echo "================================"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 错误处理
set -e

# 检查依赖
check_dependencies() {
    echo -e "${BLUE}检查编译依赖...${NC}"
    
    # 检查Node.js和npm
    if ! command -v node &> /dev/null; then
        echo -e "${RED}错误: Node.js 未安装${NC}"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}错误: npm 未安装${NC}"
        exit 1
    fi
    
    # 检查Rust和Cargo
    if ! command -v cargo &> /dev/null; then
        echo -e "${RED}错误: Rust/Cargo 未安装${NC}"
        exit 1
    fi
    
    # 检查Tauri CLI
    if ! command -v cargo-tauri &> /dev/null; then
        echo -e "${YELLOW}警告: Tauri CLI 未安装，正在安装...${NC}"
        cargo install tauri-cli
    fi
    
    echo -e "${GREEN}✓ 依赖检查完成${NC}"
}

# 安装前端依赖
install_frontend_deps() {
    echo -e "${BLUE}安装前端依赖...${NC}"
    npm install
    echo -e "${GREEN}✓ 前端依赖安装完成${NC}"
}

# 编译桌面版本（当前平台）
build_desktop() {
    echo -e "${BLUE}编译桌面版本...${NC}"
    npm run tauri build
    echo -e "${GREEN}✓ 桌面版本编译完成${NC}"
}

# 编译Windows版本（交叉编译）
build_windows() {
    echo -e "${BLUE}编译Windows版本...${NC}"
    
    # 检查是否在Windows上
    if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
        npm run tauri build
    else
        # Linux/macOS交叉编译到Windows
        echo "安装Windows目标..."
        rustup target add x86_64-pc-windows-gnu
        
        # 检查mingw是否安装
        if ! command -v x86_64-w64-mingw32-gcc &> /dev/null; then
            echo -e "${YELLOW}正在安装mingw工具链...${NC}"
            if command -v apt &> /dev/null; then
                sudo apt update && sudo apt install -y gcc-mingw-w64-x86-64
            elif command -v yum &> /dev/null; then
                sudo yum install -y mingw64-gcc
            elif command -v brew &> /dev/null; then
                brew install mingw-w64
            else
                echo -e "${RED}错误: 无法自动安装mingw，请手动安装${NC}"
                exit 1
            fi
        fi
        
        # 设置交叉编译环境变量
        export CARGO_TARGET_X86_64_PC_WINDOWS_GNU_LINKER=x86_64-w64-mingw32-gcc
        
        # 编译
        npm run tauri build -- --target x86_64-pc-windows-gnu
    fi
    
    echo -e "${GREEN}✓ Windows版本编译完成${NC}"
}

# 编译Android版本
build_android() {
    echo -e "${BLUE}编译Android版本...${NC}"
    
    # 检查Android开发环境
    if [[ -z "$ANDROID_HOME" ]]; then
        echo -e "${RED}错误: ANDROID_HOME 环境变量未设置${NC}"
        echo "请设置Android SDK路径，例如："
        echo "export ANDROID_HOME=\$HOME/Android/Sdk"
        exit 1
    fi
    
    if [[ -z "$NDK_HOME" ]]; then
        echo -e "${YELLOW}警告: NDK_HOME 未设置，尝试自动检测...${NC}"
        if [[ -d "$ANDROID_HOME/ndk" ]]; then
            export NDK_HOME=$(find $ANDROID_HOME/ndk -maxdepth 1 -type d | head -2 | tail -1)
            echo "检测到NDK: $NDK_HOME"
        else
            echo -e "${RED}错误: 未找到Android NDK${NC}"
            exit 1
        fi
    fi
    
    # 安装Android目标
    echo "安装Android Rust目标..."
    rustup target add aarch64-linux-android armv7-linux-androideabi i686-linux-android x86_64-linux-android
    
    # 初始化Android项目（如果尚未初始化）
    if [[ ! -d "src-tauri/gen/android" ]]; then
        echo "初始化Android项目..."
        npm run tauri android init
    fi
    
    # 编译Android APK
    npm run tauri android build --release
    
    echo -e "${GREEN}✓ Android版本编译完成${NC}"
}

# 主函数
main() {
    echo "选择编译目标："
    echo "1) 当前平台桌面版"
    echo "2) Windows版本"
    echo "3) Android版本"
    echo "4) 全部平台"
    echo "5) 仅检查环境"
    
    read -p "请输入选择 (1-5): " choice
    
    case $choice in
        1)
            check_dependencies
            install_frontend_deps
            build_desktop
            ;;
        2)
            check_dependencies
            install_frontend_deps
            build_windows
            ;;
        3)
            check_dependencies
            install_frontend_deps
            build_android
            ;;
        4)
            check_dependencies
            install_frontend_deps
            echo -e "${BLUE}开始全平台编译...${NC}"
            build_desktop
            echo ""
            build_windows
            echo ""
            build_android
            echo -e "${GREEN}🎉 全平台编译完成！${NC}"
            ;;
        5)
            check_dependencies
            echo -e "${GREEN}环境检查完成${NC}"
            ;;
        *)
            echo -e "${RED}无效选择${NC}"
            exit 1
            ;;
    esac
}

# 运行主函数
main
