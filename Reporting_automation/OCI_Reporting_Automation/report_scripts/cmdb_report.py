import pandas as pd
import csv
from pandas import DataFrame, ExcelWriter
import datetime
import time
import os

now = datetime.datetime.now()

day = str(now.day)
year = str(now.year)
month = str(now.month)

today = day + "-" + month + "-" + year

print("Creating cmdb report...")

path ="../results/compile"

boot_attached = pd.read_csv(path + "/boot_attached.csv")
boot = pd.read_csv(path + "/boot.csv")
images = pd.read_csv(path + "/images.csv")
instances = pd.read_csv(path + "/instances.csv")
vcn = pd.read_csv(path + "/vcn.csv")
vnic = pd.read_csv(path + "/vnic.csv")
vnic_attached = pd.read_csv(path + "/vnic_attached.csv")
volume_attached = pd.read_csv(path + "/volume_attached.csv")
subnet = pd.read_csv(path + "/subnet.csv")
shapes = pd.read_csv(path + "/shapes.csv")
nodes = pd.read_csv(path + "/nodes.csv")
nodes_ip = pd.read_csv(path + "/nodes_ip.csv")
dbaas = pd.read_csv(path + "/dbaas.csv")

nodes = pd.merge(nodes,nodes_ip,left_on="id.nodes", right_on="display-name.nodes_ip",how="left")
nodes = pd.merge(nodes,subnet,left_on="subnet-id.nodes_ip", right_on="id.subnet",how="left")
nodes = pd.merge(nodes,vcn,left_on="vcn-id.subnet", right_on="id.vcn",how="left")
nodes = pd.merge(nodes,dbaas,left_on="db-system-id.nodes", right_on="id.dbaas",how="left")

nodes.drop_duplicates(subset ="id.nodes",keep = "first", inplace = True)

nodes["u_device_category"] = "Cloud (IAAS)"
nodes["class"] = ""
nodes["vendor"] = "Oracle Public Cloud"
nodes["support_group"] = "IBM"
nodes["host_name"] =  nodes["hostname-label.nodes_ip"]
nodes["os_version"] = nodes["display-name.dbaas"]
nodes["u_opsys"] = ""
nodes["location"] = ""
nodes["oracle_shape"] = ""
nodes["Cpus"] = nodes["cpu-core-count.dbaas"]
nodes["disks"] = ""
nodes["disks_size"] = ""
nodes["memory"] = ""

nodes = nodes [
    [
        "hostname-label.nodes_ip",
        "class",
        "u_device_category",
        "os_version",
        "database-edition.dbaas",
        "host_name",
        "private-ip.nodes_ip",
        "mac-address.nodes_ip",
        "subnet-id.nodes_ip",
        "display-name.vcn",
        "vendor",
        "location",
        "lifecycle-state.nodes_ip",
        "oracle_shape",
        "Cpus",
        "disks",
        "disks_size",
        "memory",
        "support_group",
        "time-created.nodes_ip"
    ]
]

nodes.columns = [
    "name",
    "class",
    "u_device_category",
    "os_version",
    "u_opsys",
    "host_name",
    "ip_address",
    "mac_address",
    "u_network",
    "vcn",
    "vendor",
    "location",
    "install_status",
    "oracle_shape",
    "Cpus",
    "disks",
    "disks_size",
    "memory",
    "support_group",
    "install_date"
]

for index_1, row_1 in nodes.iterrows():

    for index_2, row_2 in subnet.iterrows():

        if row_1["u_network"] == row_2["id.subnet"]:

            nodes.at[index_1, 'u_network'] = row_2["cidr-block.subnet"]


nodes["install_date"] = nodes["install_date"].str[:10]









instances["time-created.instances"] = instances["time-created.instances"].str[:10]

vnic.drop_duplicates(subset='id.vnic', keep="last", inplace=True)

result = pd.merge(vnic_attached,vnic,left_on="vnic-id.vnic_attached", right_on="id.vnic",how="left")

result["is-primary.vnic"] = result["is-primary.vnic"].astype(str)
result = result.loc[result["is-primary.vnic"].str.contains("True")]

result = pd.merge(instances,result,left_on="id.instances", right_on="instance-id.vnic_attached",how="left")\
   .merge(boot_attached,left_on="id.instances", right_on="instance-id.boot_attached",how="left")

images_1 = images[["id.images","operating-system.images","display-name.images"]]
images_2 = images[["base-image-id.images","operating-system.images","display-name.images"]]
images_2.columns = ["id.images","operating-system.images","display-name.images"]
images_1 = images_1.append(images_2)
images_1 = images_1.drop_duplicates(subset=["id.images"], keep="last")

result = pd.merge(result,images_1,left_on="image-id.instances", right_on="id.images",how="left")\
   .merge(subnet,left_on="subnet-id.vnic_attached", right_on="id.subnet",how="left")\
   .merge(vcn,left_on="vcn-id.subnet", right_on="id.vcn",how="left")

volume_attached = volume_attached.loc[volume_attached["lifecycle-state.volume_attached"].str.contains("ATTACHED")]
volume_attached["Count"] = volume_attached.groupby(["instance-id.volume_attached"])["id.volume_attached"].transform("count")
volume_attached.to_csv(path + "/volume_attached.csv", index=False)
volume_attached = volume_attached.drop_duplicates(subset=["instance-id.volume_attached"], keep="last")

result = pd.merge(result,volume_attached,left_on="id.instances", right_on="instance-id.volume_attached",how="left")\
   .merge(shapes,left_on="shape.instances", right_on="oracle_shape",how="left")\
   .merge(boot,left_on="boot-volume-id.boot_attached", right_on="id.boot",how="left")

result = result.rename(columns={"Count": "disk_count.volume_attached"})
result.loc[result["disk_count.volume_attached"].isnull(), "disk_count.volume_attached"] = 0
result["disk_count.volume_attached"] += 1

result.to_csv(path + "/all.csv", index=False)


result["u_device_category"] = "Cloud (IAAS)"
result["class"] = ""
result["vendor"] = "Oracle Public Cloud"
result["support_group"] = "IBM"

result = result [
    [
        "display-name.instances",
        "class",
        "u_device_category",
        "display-name.images",
        "operating-system.images",
        "hostname-label.vnic",
        "private-ip.vnic",
        "mac-address.vnic",
        "cidr-block.subnet",
        "display-name.vcn",
        "vendor",
        "region.instances",
        "lifecycle-state.instances",
        "shape.instances",
        "Cpus",
        "disk_count.volume_attached",
        "size-in-gbs.boot",
        "memory",
        "support_group",
        "time-created.instances"
    ]
]

result.columns = [
    "name",
    "class",
    "u_device_category",
    "os_version",
    "u_opsys",
    "host_name",
    "ip_address",
    "mac_address",
    "u_network",
    "vcn",
    "vendor",
    "location",
    "install_status",
    "oracle_shape",
    "Cpus",
    "disks",
    "disks_size",
    "memory",
    "support_group",
    "install_date"
]

frames = [result, nodes]

result = pd.concat(frames)

result.to_excel("../results/cmdb-" + today + ".xlsx", sheet_name='main', index=False)
