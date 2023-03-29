# Docker命令

## 1、Docker相关

```shell
systemctl start docker // 启动docker
```

```shell
systemctl stop docker // 停止docker
```

```shell
systemctl restart docker // 重启docker
```


```shell
systemctl status docker // 查看docker状态
```

```shell
systemctl enable docker // 设置开机启动docker
```

## 2、镜像相关

```shell
docker images // 镜像列表
```

```shell
docker search 镜像名 // docker.hub搜寻镜像
```

```shell
docker pull 镜像名 // 安装镜像
```

```shell
docker rmi -f 镜像名/镜像ID // 删除镜像
```

## 3、Docker容器相关（核心）

```shell
docker ps // 查看正在运行的容器
```

```shell
docker ps -a // 查看所有容器
```

```shell
docker run 参数 // 创建并启动容器
// -i : 保持容器运行，通常与-t同时使用，-it 容器创建后会自动进入容器中
// -t : 为容器重新分配一个伪输入终端，通常与-i同时使用
// -d : 以后台模式运行容器，创建一个容器后台运行，需要使用 docker exec 进入容器
// -p : 端口3307:3306，表示将容器3306端口映射宿主机3307端口
// --name : 容器命名
// -v: 挂载数据卷

```

```shell
// 创建端口示例
docker run -id \
-p 3307:3306 \
--name=c_mysql \
-v $PWD/conf:/etc/mysql/conf.d \
-v $PWD/logs:/logs \
-v $PWD/data:/var/lib/mysql \
-e MYSQL_ROOT_PASSWORD=123456 \
mysql
```

```shell
docker exec 参数 // 进入容器 ：docker exec -it 容器名/容器ID /bin/bash
```

```shell
docker stop 容器名 // 停止容器
```

```shell
docker start 容器名 //  启动容器
```

```shell
docker rm 容器名 // 删除容器
```

```shell
docker inspect 容器名 // 查看容器信息
```

```shell
docker logs -f --tail=要查看末尾多少行 默认all 容器ID
```
