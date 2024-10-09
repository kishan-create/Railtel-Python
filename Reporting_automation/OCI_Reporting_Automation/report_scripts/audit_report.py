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

print("CREATING AUDIT REPORT...")

path ="../results/compile"

print(" - AUDIT REPORT: Dataset import complete...")
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
nodes = pd.read_csv(path + "/nodes_ip.csv")
images = pd.read_csv(path + "/images.csv")
instances = pd.read_csv(path + "/instances.csv")
object_storage = pd.read_csv(path + "/bucket.csv")
default_route = pd.read_csv(path + "/default_route.csv")
drg = pd.read_csv(path + "/drg.csv")
drg_attached = pd.read_csv(path + "/drg_attachment.csv")
internet_gateway = pd.read_csv(path + "/internet_gateway.csv")
security_list = pd.read_csv(path + "/security_list.csv")
public_ip = pd.read_csv(path + "/public_ip.csv")
fast_connect = pd.read_csv(path + "/fast_connect.csv")
virtual_circuit = pd.read_csv(path + "/virtual_circuit.csv")
block_storage = pd.read_csv(path + "/volume.csv")

print(" - AUDIT REPORT: Node dataset formated...")
nodes["u_device_category"] = "Cloud (IAAS)"
nodes["class"] = ""
nodes["vendor"] = "Oracle Public Cloud"
nodes["support_group"] = "IBM"
nodes["host_name"] =  nodes["hostname-label.nodes_ip"]
nodes["os_version"] = ""
nodes["u_opsys"] = ""
nodes["location"] = ""
nodes["oracle_shape"] = ""
nodes["Cpus"] = ""
nodes["disks"] = ""
nodes["disks_size"] = ""
nodes["memory"] = ""

nodes = nodes [
    [
        "hostname-label.nodes_ip",
        "class",
        "u_device_category",
        "os_version",
        "u_opsys",
        "host_name",
        "private-ip.nodes_ip",
        "mac-address.nodes_ip",
        "subnet-id.nodes_ip",
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

all = result





















print(" - AUDIT REPORT: Block volume dataset formated...")
block_storage["time-created.volume"] = block_storage["time-created.volume"].str[:10]
block_storage = pd.merge(block_storage,volume_attached,left_on="id.volume", right_on="volume-id.volume_attached",how="left")\
    .merge(instances,left_on="instance-id.volume_attached", right_on="id.instances",how="left")

block_storage["description"] = ""
block_storage["backup_policy"] = ""

block_storage = block_storage [
    [
        "id.volume",
        "display-name.volume",
        "description",
        "size-in-gbs.volume",
        "availability-domain.volume",
        "backup_policy",
        "display-name.instances",
        "time-created.volume",
        "attachment-type.volume_attached",
        "lifecycle-state.volume"
    ]
]

block_storage.columns = [
    "ocid",
    "name",
    "description",
    "size",
    "availability_domain",
    "backup_policy",
    "attached_instance",
    "date_created",
    "protocol",
    "status"
]







print(" - AUDIT REPORT: Object storage dataset formated...")
object_storage["time-created.bucket"] = object_storage["time-created.bucket"].str[:10]

object_storage["description"] = ""
object_storage["storage_tier"] = ""

object_storage = object_storage [
    [
        "name.bucket",
        "description",
        "storage_tier",
        "namespace.bucket",
        "created-by.bucket",
        "time-created.bucket"
    ]
]

object_storage.columns = [
    "name",
    "description",
    "storage_tier",
    "namespace",
    "created_by",
    "date_created"
]



print(" - AUDIT REPORT: VCN dataset formated...")
vcn["time-created.vcn"] = vcn["time-created.vcn"].str[:10]

print(" - AUDIT REPORT: Default route dataset formated...")
default_route['display-name.default_route'] = default_route.groupby(['vcn-id.default_route'])['display-name.default_route'].transform(lambda x: ','.join(x))
default_route['vcn-id.default_route'] = default_route['vcn-id.default_route'].drop_duplicates()

temp = pd.merge(vcn,default_route,left_on="id.vcn", right_on="vcn-id.default_route",how="left")

temp["compartment"] = "NGServices"

temp = temp [
    [
        "id.vcn",
        "display-name.vcn",
        "cidr-block.vcn",
        "compartment",
        "display-name.default_route",
        "vcn-domain-name.vcn",
        "time-created.vcn",
        "lifecycle-state.vcn"
    ]
]

temp.columns = [
    "ocid",
    "name.vcn",
    "cidr_block",
    "compartment",
    "default_route_table",
    "dns_domain_name",
    "date_created",
    "status"
]









print(" - AUDIT REPORT: DRG dataset formated...")
drg["time-created.drg"] = drg["time-created.drg"].str[:10]

temp = pd.merge(drg,drg_attached,left_on="id.drg", right_on="drg-id.drg_attachment",how="left")
temp = pd.merge(temp,vcn,left_on="vcn-id.drg_attachment", right_on="id.vcn",how="left")
temp = pd.merge(temp,virtual_circuit,left_on="id.drg", right_on="gateway-id.virtual_circuit",how="left")

temp["compartment"] = "NGServices"
temp["ipsec_vpn"] = "N/A"
temp["remote_peering_connection"] = "N/A"


temp = temp [
    [
        "id.drg",
        "display-name.drg",
        "compartment",
        "ipsec_vpn",
        "display-name.vcn",
        "display-name.virtual_circuit",
        "remote_peering_connection",
        "time-created.drg",
        "lifecycle-state.drg"
    ]
]

temp.columns = [
    "ocid",
    "name",
    "compartment",
    "ipsec_vpn",
    "assigned_vcn",
    "virtual_circuit",
    "remote_peering_connection",
    "date_created",
    "status"
]



print(" - AUDIT REPORT: Internet Gateway dataset formated...")
internet_gateway["time-created.internet_gateway"] = internet_gateway["time-created.internet_gateway"].str[:10]

internet_gateway["compartment"] = "NGServices"

internet_gateway = internet_gateway [
    [
        "id.internet_gateway",
        "display-name.internet_gateway",
        "compartment",
        "lifecycle-state.internet_gateway",
        "time-created.internet_gateway"
    ]
]

internet_gateway.columns = [
    "ocid",
    "name",
    "compartment",
    "status",
    "date_created"
]



print(" - AUDIT REPORT: Subnet dataset formated...")
subnet["time-created.subnet"] = subnet["time-created.subnet"].str[:10]

security_list['display-name.security_list'] = security_list.groupby(['vcn-id.security_list'])['display-name.security_list'].transform(lambda x: ','.join(x))
security_list['vcn-id.security_list'] = security_list['vcn-id.security_list'].drop_duplicates()

subnet['security-list-ids.subnet'] = subnet['security-list-ids.subnet'].str.replace('\[u\'','').str.replace('\'\]','')

subnet = pd.merge(subnet,default_route,left_on="route-table-id.subnet", right_on="id.default_route",how="left")\
    .merge(security_list,left_on="security-list-ids.subnet", right_on="id.security_list",how="left")


subnet["subnet_access"] = "Private Subnet"

subnet = subnet [
    [
        "id.subnet",
        "display-name.subnet",
        "cidr-block.subnet",
        "virtual-router-mac.subnet",
        "availability-domain.subnet",
        "display-name.default_route",
        "display-name.security_list",
        "subnet_access",
        "subnet-domain-name.subnet",
        "time-created.subnet",
        "lifecycle-state.subnet"
    ]
]

subnet.columns = [
    "ocid",
    "name",
    "cidr_block",
    "mac_address",
    "availability_domain",
    "route_table",
    "security_list",
    "subnet_access",
    "dns_domain_name",
    "date_created",
    "status"
]


print(" - AUDIT REPORT: Public IP dataset formated...")
public_ip["time-created.public_ip"] = public_ip["time-created.public_ip"].str[:10]

public_ip["compartment"] = "NGServices"
public_ip["assigned_to_private_ip_address"] = ""

public_ip = public_ip [
    [
        "id.public_ip",
        "display-name.public_ip",
        "ip-address.public_ip",
        "compartment",
        "assigned_to_private_ip_address",
        "time-created.public_ip",
        "lifecycle-state.public_ip"
    ]
]

public_ip.columns = [
    "ocid",
    "name",
    "reserved_public_ip",
    "compartment",
    "assigned_to_private_ip_address",
    "date_created",
    "status"
]




print(" - AUDIT REPORT: Fast connect dataset formated...")
fast_connect['supported-virtual-circuit-types.fast_connect'] = fast_connect['supported-virtual-circuit-types.fast_connect'].str.replace('\[u\'','').str.replace('\'\]','').str.replace('\'','').str.replace(' u','')

fast_connect["compartment"] = "NGServices"
fast_connect["connection_type"] = "Provider Connection"
fast_connect["trusted/semi_trusted"] = ""
fast_connect["circuit_id"] = ""
fast_connect["state"] = ""
fast_connect["date_created"] = ""

fast_connect = fast_connect [
    [
        "id.fast_connect",
        "provider-name.fast_connect",
        "compartment",
        "connection_type",
        "supported-virtual-circuit-types.fast_connect",
        "trusted/semi_trusted",
        "provider-service-name.fast_connect",
        "circuit_id",
        "state",
        "date_created"
    ]
]

fast_connect.columns = [
        "ocid",
        "name",
        "compartment",
        "connection_type",
        "circuit_types",
        "trusted/semi_trusted",
        "provider_name",
        "circuit_id",
        "state",
        "date_created"
]


print(" - AUDIT REPORT: All dataset formated...")
all["description"] = ""
all["attached_block_volume_names"] = ""
all["owner"] = ""
all["requestor"] = ""
all["app_support_partner"] = "IBM"
all["confidentiality"] = ""
all["tags"] = ""
all["region"] = "uk-london-1"
all["compartment"] = "NGServices"

all = all [
    [
        "id.instances",
        "display-name.instances",
        "hostname-label.vnic",
        "description",
        "display-name.images",
        "size-in-gbs.boot",
        "private-ip.vnic",
        "oracle_shape",
        "region",
        "availability-domain.instances",
        "compartment",
        "display-name.vcn",
        "display-name.subnet",
        "attached_block_volume_names",
        "time-created.instances",
        "lifecycle-state.instances",
        "tags",
        "owner",
        "requestor",
        "app_support_partner",
        "confidentiality"
    ]
]

all.columns = [
    "ocid",
    "virtual_machine_name",
    "os_hostname",
    "description",
    "image",
    "boot_volume",
    "ip_address",
    "shape",
    "region",
    "availability_domain",
    "compartment",
    "vcn",
    "subnet",
    "attached_block_volume_names",
    "data_created",
    "status",
    "tags",
    "owner",
    "requestor",
    "app_support_partner",
    "confidentiality"
]


print(" - AUDIT REPORT: Outputing results...")
with pd.ExcelWriter("../results/audit-" + today + ".xlsx") as writer:
    block_storage.to_excel(writer, sheet_name='block_storage', index=False)
    instances.to_excel(writer, sheet_name='instances', index=False)
    fast_connect.to_excel(writer, sheet_name='fast_connect', index=False)
    public_ip.to_excel(writer, sheet_name='public_ip', index=False)
    subnet.to_excel(writer, sheet_name='subnet', index=False)
    internet_gateway.to_excel(writer, sheet_name='internet_gateway', index=False)
    drg.to_excel(writer, sheet_name='drg', index=False)
    vcn.to_excel(writer, sheet_name='vcn', index=False)
    object_storage.to_excel(writer, sheet_name='object_storage', index=False)

print(" - AUDIT REPORT: Completed...")