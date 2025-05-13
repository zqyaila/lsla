#!/bin/bash

# 更新系统并安装基础依赖
sudo apt update -y
sudo apt install -y git python3 python3-pip nodejs npm

# 检查 git 安装
if ! command -v git &> /dev/null; then
    echo "错误：git 未安装，请手动安装后重试"
    exit 1
fi

# 读取用户输入的 Bot 目录上级路径
read -p "请输入 Bot 目录的上级路径（例如：./Wuyi）： " -r bot_parent_dir
cd "$bot_parent_dir" || {
    echo "错误：目录 $bot_parent_dir 不存在"
    exit 1
}

# 克隆 gsuid_core 仓库
git clone --depth=1 --single-branch https://github.com/Genshin-bots/gsuid_core.git
cd gsuid_core || {
    echo "错误：进入 gsuid_core 目录失败"
    exit 1
}

# 选择依赖安装方式
echo "请选择依赖安装方式："
echo "1. uv（推荐，自动管理依赖）"
echo "2. poetry（Python 依赖管理工具）"
echo "3. pdm（另一种 Python 依赖管理工具）"
echo "4. 直接使用 python（不推荐，可能出现依赖问题）"

while true; do
    read -p "请输入选项（1-4）： " install_option
    case $install_option in
        1)
            # 安装 uv 并同步依赖
            if ! command -v uv &> /dev/null; then
                npm install -g uv
            fi
            uv sync
            uv run python -m ensurepip
            break
            ;;
        2)
            # 安装 poetry 并安装依赖
            if ! command -v poetry &> /dev/null; then
                curl -sSL https://install.python-poetry.org | python3 -
            fi
            poetry install
            break
            ;;
        3)
            # 安装 pdm 并安装依赖
            if ! command -v pdm &> /dev/null; then
                pip install pdm
            fi
            pdm install
            pdm run python -m ensurepip
            break
            ;;
        4)
            echo "警告：不推荐此方式，可能导致依赖问题！"
            read -p "是否继续？(y/n)： " continue_opt
            if [[ $continue_opt =~ ^[Yy]$ ]]; then
                python -m pip install -r requirements.txt
                break
            else
                exit 0
            fi
            ;;
        *)
            echo "无效选项，请输入 1-4 之间的数字"
            ;;
    esac
done

# 询问是否安装 WutheringWavesUID 2.0 插件
read -p "是否安装 WutheringWavesUID 2.0 插件？(y/n)： " -r install_plugin
if [[ $install_plugin =~ ^[Yy]$ ]]; then
    cd gsuid_core || {
        echo "错误：进入 plugins 目录失败"
        exit 1
    }
    mkdir -p plugins  # 确保 plugins 目录存在
    cd plugins || {
        echo "错误：进入 plugins 目录失败"
        exit 1
    }
    git clone --depth=1 --single-branch https://github.com/tyql688/WutheringWavesUID.git
    echo "插件安装完成！"
else
    echo "跳过插件安装"
fi

echo "GsCore 安装完成！"
echo "请进入 gsuid_core 目录并启动 Bot：cd gsuid_core && cd gsuid_core && uv run core"
