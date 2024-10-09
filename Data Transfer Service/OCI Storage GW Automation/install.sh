rm -rf /ocisg
mkdir /ocisgw
mkfs.ext4 /dev/sda
mount /dev/sda /ocisgw
cp /etc/fstab /etc/fstab.orig
grep -v /ocisg /etc/fstab > /etc/fstab.bkp
cp /etc/fstab.bkp /etc/fstab 
export val=`blkid -s UUID -o value /dev/sda`
echo "UUID=$val /ocisg    ext4       defaults      0      0" >> /etc/fstab
mkdir -p /ocisgw/metadata
mkdir -p /ocisgw/cache
mkdir -p /ocisgw/log
mkdir -p /ocisgw/data
cd /opt/ocisg-1.4
./ocisg-install.sh -q -m /ocisgw/metadata -c /ocisgw/cache -l /ocisgw/log

