import pandas as pd
import csv
from pandas import DataFrame, ExcelWriter
import datetime
import time
import os
import glob

now = datetime.datetime.now()
day = str(now.day)
year = str(now.year)
month = str(now.month)
today = day + '-' + month + '-' + year

path ='../results/compile'

instances_file = pd.read_csv(path + '/instances.csv')
boot = pd.read_csv(path + '/boot.csv')
volumes = pd.read_csv(path + '/volume.csv')
shapes = pd.read_csv(path + '/shapes.csv')
images = pd.read_csv(path + '/images.csv')
# volume_backup = pd.read_csv(path + '/backup.csv')
volume_attached = pd.read_csv(path + '/volume_attached.csv')
boot_attached = pd.read_csv(path + '/boot_attached.csv')
# boot_backup = pd.read_csv(path + '/boot_backup_volumes.csv')
# fast_connect = pd.read_csv(path + '/fast_connect.csv')
# load_balancer = pd.read_csv(path + '/load_balancer.csv')
# nodes = pd.read_csv(path + "/nodes.csv")
# nodes_ip = pd.read_csv(path + "/nodes_ip.csv")
# dbaas = pd.read_csv(path + "/dbaas.csv")
subnet = pd.read_csv(path + "/subnet.csv")
vcn = pd.read_csv(path + "/vcn.csv")
vnic_attached = pd.read_csv(path + "/vnic_attached.csv")
vnic = pd.read_csv(path + "/vnic.csv")

vnic_attached = pd.merge(vnic_attached,vnic,left_on='vnic-id.vnic_attached', right_on='id.vnic',how='left')
subnet = pd.merge(subnet,vcn,left_on='vcn-id.subnet', right_on='id.vcn',how='left')

# Combine block volume and attached block volume
volume_combined = pd.merge(volumes,volume_attached,left_on='id.volume', right_on='volume-id.volume_attached',how='left')

boot_combined = pd.merge(boot,boot_attached,left_on='id.boot', right_on='boot-volume-id.boot_attached',how='left')

# volume_backup = pd.merge(volume_backup,volume_attached,left_on='volume-id.backup', right_on='volume-id.volume_attached',how='left')
# volume_backup = volume_backup.groupby(['instance-id.volume_attached'])['unique-size-in-gbs.backup'].sum().reset_index()

# boot_backup = pd.merge(boot_backup,boot_attached,left_on='boot-volume-id.boot_backup_volumes', right_on='boot-volume-id.boot_attached',how='left')
# boot_backup = boot_backup.groupby(['instance-id.boot_attached'])['unique-size-in-gbs.boot_backup_volumes'].sum().reset_index()

instances = pd.merge(instances_file,boot_combined,left_on='id.instances', right_on='instance-id.boot_attached',how='left')\
    .merge(shapes,left_on='shape.instances', right_on='oracle_shape',how='left')\
    .merge(images,left_on='image-id.instances', right_on='id.images',how='left')\
    .merge(vnic_attached,left_on='id.instances', right_on='instance-id.vnic_attached',how='left')

instances = pd.merge(instances,subnet,left_on='subnet-id.vnic_attached', right_on='id.subnet',how='left')


# instances['display-name.images'] = instances['operating-system.images'] + ' ' + instances['operating-system-version.images']
# instances['display-name.images'] = instances['display-name.images'].str.replace('Custom Custom', 'Custom')

instances.drop_duplicates(subset='id.instances', keep='last', inplace=True)

instances = instances [
    [
        'display-name.instances',
        'id.instances',
		'availability-domain.instances',
		'public-ip.vnic',
        'private-ip.vnic',
		'fault-domain.instances',
		'region.instances',
        'lifecycle-state.instances',
        'display-name.subnet',
        'display-name.vcn',    
        # 'defined-tags.instances',
        # 'freeform-tags.instances',
        'shape.instances',
        'Cpus',
        'memory',
		'time-created.instances'
        # 'display-name.images',
        # 'unique-size-in-gbs.backup',
        # 'unique-size-in-gbs.boot_backup_volumes',
        # 'size-in-gbs.boot'
    ]
]

instances.columns = [
    'Display-Name.',
    'ID',
	'Availability-Domain',
	'Public IP Address',
    'Private IP Address',
	'Fault-Domain',
	'Region',
    'Status',
    'Subnet',
    'VCN',
    # 'Defined-tags',
    # 'Freeform-tags',
    'Shape',
    'CPU',
    'Memory',
	'Time-Created'
    # 'Operating-System',
    # 'Total Block Volume Backup (GB)',
    # 'Total Boot Volume Backup (GB)',
    # 'Boot Volume (GB)'
]

# print(" - Adding block volumes to instance dataset...")
# for index, row in instances.iterrows():
#     count = 1
#     for index_1, row_1 in volume_combined.iterrows():
#         if row["ID"] == row_1["instance-id.volume_attached"]:
#             instances.at[index, "Block Volume " + str(count) + " (GB)"] = row_1["size-in-gbs.volume"]
#             count = count + 1
#     count = 1

# count_block_volume = len(instances.filter(regex='Block Volume \d', axis=1).count())

# for i in range(count_block_volume):
#     instances["Block Volume " + str(i+1) + " (GB)"] = instances["Block Volume " + str(i+1) + " (GB)"].fillna(0)

# print(" - Adding total block volume size to instance dataset...")
# for index, row in instances.iterrows():
#     total = 0
#     for i in range(count_block_volume):
#         total = total + row["Block Volume " + str(i+1) + " (GB)"]
#     total = total + row["Boot Volume (GB)"]
#     instances.at[index, "Total Boot & Volume (GB)"] = total



# fast_connect['supported-virtual-circuit-types.fast_connect'] = fast_connect['supported-virtual-circuit-types.fast_connect'].str.replace('\[u\'','').str.replace('\'\]','').str.replace('\'','').str.replace(' u','')

# fast_connect = fast_connect [
#     [
#         'provider-name.fast_connect',
#         'id.fast_connect',
#         'supported-virtual-circuit-types.fast_connect',
#         'provider-service-name.fast_connect'
#     ]
# ]

# fast_connect.columns = [
#         'Display Name',
#         'OCID',
#         'Circuit Types',
#         'Provider Name'
# ]





# load_balancer = load_balancer [[
#     'display-name.load_balancer',
#     'id.load_balancer',
#     'lifecycle-state.load_balancer',
#     'shape-name.load_balancer',
# ]]

# load_balancer.columns = [
#     'Display Name',
#     'OCID',
#     'Status',
#     'Shape'
# ]

# nodes = pd.merge(nodes,nodes_ip,left_on="id.nodes", right_on="display-name.nodes_ip",how="left")
# nodes = pd.merge(nodes,dbaas,left_on="db-system-id.nodes", right_on="id.dbaas",how="left")
# nodes.drop_duplicates(subset='id.nodes', keep='last', inplace=True)

# nodes = nodes [[
#     "hostname.nodes",
#     "id.nodes",
#     "software-storage-size-in-gb.nodes",
#     "display-name.dbaas",
#     "database-edition.dbaas",
#     "version.dbaas",
#     "shape.dbaas",
#     "cpu-core-count.dbaas",
#     "data-storage-size-in-gbs.dbaas",
#     "reco-storage-size-in-gb.dbaas",
#     "defined-tags.dbaas",
#     "freeform-tags.dbaas",
#     "node-count.dbaas"
# ]]

# nodes.columns = [
#     "Node Display Name",
#     "Node OCID",
#     "Node Software Storage (GB)",
#     "DBaaS Cluster Display Name",
#     "Database Edition",
#     "Version",
#     "Shape",
#     "CPU Core",
#     "Data Storage (GB)",
#     "Reco Storage (GB)",
#     "Defined Tags",
#     "Freeform Tags",
#     "No. Nodes"
# ]

with pd.ExcelWriter('../results/inventory-report-' + today + '.xlsx') as writer:
    instances.to_excel(writer, sheet_name='instances', index=False)
    # load_balancer.to_excel(writer, sheet_name='load_balancer', index=False)
    # fast_connect.to_excel(writer, sheet_name='fastconnect', index=False)
    # nodes.to_excel(writer, sheet_name='dbaas', index=False)