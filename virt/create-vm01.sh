#!/usr/bin/env sh

set -xu

sudo virt-install \
	--name vm01 \
	--ram 1024 \
	--vcpus 1 \
    --disk path=vm01.qcow2,format=qcow2,bus=virtio \
	--osinfo detect=on,name=linux2022 \
	--network bridge=virbr2,model=virtio \
	--network network=lan2,model=virtio \
	--graphics none \
	--console pty,target_type=serial \
    --boot hd

