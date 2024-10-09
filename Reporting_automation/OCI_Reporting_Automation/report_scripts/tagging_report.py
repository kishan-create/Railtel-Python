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

print("Creating tagging report...")
path ="../results/compile"

instances = pd.read_csv(path + "/instances.csv")
vcn = pd.read_csv(path + "/vcn.csv")
vnic = pd.read_csv(path + "/vnic.csv")
vnic_attached = pd.read_csv(path + "/vnic_attached.csv")
volume = pd.read_csv(path + "/volume.csv")
subnet = pd.read_csv(path + "/subnet.csv")
dbaas = pd.read_csv(path + "/dbaas.csv")
load_balancer = pd.read_csv(path + "/load_balancer.csv")

vnic.drop_duplicates(subset='id.vnic', keep="last", inplace=True)

result = pd.merge(vnic_attached,vnic,left_on="vnic-id.vnic_attached", right_on="id.vnic",how="left")

result["is-primary.vnic"] = result["is-primary.vnic"].astype(str)
result = result.loc[result["is-primary.vnic"].str.contains("True")]

result = pd.merge(instances,result,left_on="id.instances", right_on="instance-id.vnic_attached",how="left")

result = pd.merge(result,subnet,left_on="subnet-id.vnic_attached", right_on="id.subnet",how="left")\
   .merge(vcn,left_on="vcn-id.subnet", right_on="id.vcn",how="left")

# res = [k for k in list(result) if 'instance' in k]
# res = [k for k in list(res) if 'tag' in k]

fields = [
    "display-name.instances",
    "id.instances",
    "display-name.vcn",
    "defined-tags.instances",
    "freeform-tags.instances"
]

# fields = fields + res
result = result[fields]

result.rename(columns={
'display-name.instances':'Display Name',
'id.instances':'OCID',
'display-name.vcn':'VCN',
'defined-tags.instances':'Defined-tags',
'freeform-tags.instances':'Freeform-tags'}, inplace=True)

result["Defined-tags"] = result["Defined-tags"].str.replace('u\'','\'')
result["Freeform-tags"] = result["Freeform-tags"].str.replace('u\'','\'')

# result.to_csv("./tagging_report/instance.csv", index=False)

############################################################################

# res = [k for k in list(volume) if 'tag' in k]

fields = [
    "display-name.volume",
    "id.volume",
    "defined-tags.volume",
    "freeform-tags.volume"
]

# fields = fields + res
volume = volume[fields]

volume.rename(columns={
'display-name.volume':'Display Name',
'id.volume':'OCID',
'defined-tags.volume':'Defined-tags',
'freeform-tags.volume':'Freeform-tags'}, inplace=True)

volume["Defined-tags"] = volume["Defined-tags"].str.replace('u\'','\'')
volume["Freeform-tags"] = volume["Freeform-tags"].str.replace('u\'','\'')

# volume.to_csv("./tagging_report/volume.csv", index=False)

############################################################################

# res = [k for k in list(dbaas) if 'tag' in k]

fields = [
    "display-name.dbaas",
    "cluster-name.dbaas",
    "id.dbaas",
    "domain.dbaas",
    "defined-tags.dbaas",
    "freeform-tags.dbaas"
]

# fields = fields + res
dbaas = dbaas[fields]

dbaas.rename(columns={
'display-name.dbaas':'Display Name',
'cluster-name.dbaas':'CLuster Name',
'id.dbaas':'OCID',
'domain.dbaas':'Domain',
'defined-tags.dbaas':'Defined-tags',
'freeform-tags.dbaas':'Freeform-tags'}, inplace=True)

dbaas["Defined-tags"] = dbaas["Defined-tags"].str.replace('u\'','\'')
dbaas["Freeform-tags"] = dbaas["Freeform-tags"].str.replace('u\'','\'')

# dbaas.to_csv("./tagging_report/dbaas.csv", index=False)

############################################################################

load_balancer["subnet-ids.load_balancer"] = load_balancer["subnet-ids.load_balancer"].str.replace('\[u\'','').str.replace('\'\]','')

for index_1, row_1 in load_balancer.iterrows():
    for index_2, row_2 in subnet.iterrows():
        if row_1["subnet-ids.load_balancer"] == row_2["id.subnet"]:
            load_balancer.at[index_1, 'subnet-ids.load_balancer'] = row_2["vcn-id.subnet"]

for index_1, row_1 in load_balancer.iterrows():
    for index_2, row_2 in vcn.iterrows():
        if row_1["subnet-ids.load_balancer"] == row_2["id.vcn"]:
            load_balancer.at[index_1, 'subnet-ids.load_balancer'] = row_2["display-name.vcn"]

# res = [k for k in list(load_balancer) if 'tag' in k]

fields = [
        "display-name.load_balancer",
        "id.load_balancer",
        "subnet-ids.load_balancer",
        "defined-tags.load_balancer",
        "freeform-tags.load_balancer"
]

# fields = fields + res
load_balancer = load_balancer[fields]

load_balancer.rename(columns={
'display-name.load_balancer':'Display Name',
'id.load_balancer':'OCID',
'subnet-ids.load_balancer':'VCN',
'defined-tags.load_balancer':'Defined-tags',
'freeform-tags.load_balancer':'Freeform-tags'}, inplace=True)

load_balancer["Defined-tags"] = load_balancer["Defined-tags"].str.replace('u\'','\'')
load_balancer["Freeform-tags"] = load_balancer["Freeform-tags"].str.replace('u\'','\'')

# load_balancer.to_csv("./tagging_report/load_balancer.csv", index=False)

with pd.ExcelWriter("../results/tagging-report-" + today + ".xlsx") as writer:
    result.to_excel(writer, sheet_name='instance', index=False)
    volume.to_excel(writer, sheet_name='volume', index=False)
    dbaas.to_excel(writer, sheet_name='dbaas', index=False)
    load_balancer.to_excel(writer, sheet_name='load_balancer', index=False)
