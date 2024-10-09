import pandas as pd
import csv
from pandas import DataFrame, ExcelWriter
import datetime
import time
import os
import glob

print("Creating biilable Report...")

if not os.path.exists("../results/billable_report"):
    os.makedirs("../results/billable_report")

now = datetime.datetime.now()
day = str(now.day)
year = str(now.year)
month = str(now.month)
today = day + "-" + month + "-" + year


path ="../results/compile"








# format_boot().to_csv(path + "/test.csv", index=False )









volumes = pd.read_csv(path + "/volume.csv")
volume_attached = pd.read_csv(path + "/volume_attached.csv")
# dbaas = pd.read_csv("./compile/dbass.csv")

volume_combined = pd.merge(volumes,volume_attached,left_on="id.volume", right_on="volume-id.volume_attached",how="left")

boot = pd.read_csv(path + "/boot.csv")
boot_attached = pd.read_csv(path + "/boot_attached.csv")
boot_combined = pd.merge(boot,boot_attached,left_on="id.boot", right_on="boot-volume-id.boot_attached",how="left")

instances_file = pd.read_csv(path + "/instances.csv")
instances = pd.merge(instances_file,boot_combined,left_on="id.instances", right_on="instance-id.boot_attached",how="left")
instances.to_csv("../results/billable_report/instances_combined.csv", index=False )


volume_backup = pd.read_csv(path + "/volume_backup.csv")
volume_backup_policy = pd.read_csv(path + "/volume_backup_policy.csv")

print(" - Merging volume backup and policy...")
volume_backup_policy_combined = pd.merge(volume_backup,volume_backup_policy,left_on="policy-id.volume_backup", right_on="id.volume_backup_policy",how="left")
volume_backup_policy_combined.to_csv("../results/billable_report/volume_backup_policy_combined.csv", index=False )

print(" - Merging volume and policy...")
volume_and_policy = pd.merge(volumes,volume_backup_policy_combined,left_on="id.volume", right_on="asset-id.volume_backup",how="left")
volume_and_policy.to_csv("../results/billable_report/volume_and_policy.csv", index=False )

volume_backup = pd.read_csv(path + "/backup.csv")

volume_and_policy = volume_and_policy [[
    "display-name.volume",
    "id.volume",
    "lifecycle-state.volume",
    "size-in-gbs.volume",
    "time-created.volume",
    "display-name.volume_backup_policy"

]]

volume_and_policy.columns = [
    "Display Name",
    "OCID",
    "Status",
    "Size (GB)",
    "Time Created",
    "Policy"
]

print(" - Assigning backup to block volume dateset...")
for index_1, row_1 in volume_and_policy.iterrows():
    count = 1
    for index_2, row_2 in volume_backup.iterrows():
        if row_1["OCID"] == row_2["volume-id.backup"]:
            volume_and_policy.at[index_1, "Backup " + str(count) + " Usage (GB)"] = row_2["unique-size-in-gbs.backup"]
            count = count + 1
    count = 1
# volume_and_policy.to_csv( "../results/billable_report/volume.csv", index=False )


print(" - Boot backup dataset formated...")
boot_backup = pd.read_csv(path + "/boot_backup.csv")
boot_backup_policy = pd.read_csv(path + "/volume_backup_policy.csv")
boot_backup_policy_combined = pd.merge(boot_backup,boot_backup_policy,left_on="policy-id.boot_backup", right_on="id.volume_backup_policy",how="left")
boot_and_policy = pd.merge(boot,boot_backup_policy_combined,left_on="id.boot", right_on="asset-id.boot_backup",how="left")
boot_and_policy.to_csv(path + "/boot_and_policy.csv", index=False )
boot_backup_volumes = pd.read_csv(path + "/boot_backup_volumes.csv")

boot_and_policy = boot_and_policy [[
    "display-name.boot",
    "id.boot",
    "lifecycle-state.boot",
    "size-in-gbs.boot",
    "time-created.boot",
    "display-name.volume_backup_policy"

]]

boot_and_policy.columns = [
    "Display Name",
    "OCID",
    "Status",
    "Size (GB)",
    "Time Created",
    "Policy"
]

print(" - Adding backup to boot volume dateset...")
for index_1, row_1 in boot_and_policy.iterrows():
    count = 1
    for index_2, row_2 in boot_backup_volumes.iterrows():
        if row_1["OCID"] == row_2["boot-volume-id.boot_backup_volumes"]:
            boot_and_policy.at[index_1, "Backup " + str(count) + " Usage (GB)"] = row_2["unique-size-in-gbs.boot_backup_volumes"]
            count = count + 1
    count = 1
# # boot_and_policy.to_csv( "../results/billable_report/boot.csv", index=False )












print(" - Adding block volumes to instance dataset...")
for index, row in instances.iterrows():
    count = 1
    for index_1, row_1 in volume_combined.iterrows():
        if row["id.instances"] == row_1["instance-id.volume_attached"]:
            instances.at[index, "Block Volume " + str(count)] = row_1["size-in-gbs.volume"]
            count = count + 1
    count = 1

count_block_volume = len(instances.filter(regex='Block Volume \d', axis=1).count())

for i in range(count_block_volume):
    instances["Block Volume " + str(i+1)] = instances["Block Volume " + str(i+1)].fillna(0)

print(" - Adding total block volume size to instance dataset...")
for index, row in instances.iterrows():
    total = 0
    for i in range(count_block_volume):
        total = total + row["Block Volume " + str(i+1)]
    total = total + row["size-in-gbs.boot"]
    instances.at[index, "Total Disk"] = total

print(" - Formating instance columns...")
columns = []
columns.append("display-name.instances")
columns.append("id.instances")
columns.append("shape.instances")
columns.append("size-in-gbs.boot")
for i in range(count_block_volume):
    columns.append("Block Volume " + str(i+1))
columns.append("Total Disk")
instances = instances [columns]

columns = []
columns.append("Display Name")
columns.append("OCID")
columns.append("Shape")
columns.append("Boot Volume")
for i in range(count_block_volume):
    columns.append("Block Volume " + str(i+1))
columns.append("Total Disk")
instances.columns = columns

instances.to_csv( "../results/billable_report/instance.csv", index=False)

print(" - Load Balancer dataset formated...")
load_balancer = pd.read_csv(path + "/load_balancer.csv")
load_balancer = load_balancer [[
    "display-name.load_balancer",
    "id.load_balancer",
    "lifecycle-state.load_balancer",
    "shape-name.load_balancer",
]]

load_balancer.columns = [
    "Display Name",
    "OCID",
    "Status",
    "Shape"
]

load_balancer.to_csv( "../results/billable_report/load_balancer-" + today + ".csv", index=False)


print(" - Outputing results...")

with pd.ExcelWriter("../results/billable-report" + today + ".xlsx") as writer:
    volume_and_policy.to_excel(writer, sheet_name='volume', index=False)
    boot_and_policy.to_excel(writer, sheet_name='boot', index=False)
    instances.to_excel(writer, sheet_name='instances', index=False)
    load_balancer.to_excel(writer, sheet_name='load_balancer', index=False)


print(" - Completed...")


def format_boot():

    path ="../results/compile"

    # Datesets
    boot_backup = pd.read_csv(path + "/boot_backup.csv")
    boot_backup_policy = pd.read_csv(path + "/volume_backup_policy.csv")
    boot = pd.read_csv(path + "/boot.csv")

    # Merge boot_backup & boot_backup_policy
    boot_backup_and_boot_backup_policy = pd.merge(boot_backup,boot_backup_policy,left_on="policy-id.boot_backup", right_on="id.volume_backup_policy",how="left")
    # Merge boot & boot_backup_and_boot_backup_policy
    results = pd.merge(boot,boot_backup_and_boot_backup_policy,left_on="id.boot", right_on="asset-id.boot_backup",how="left")

    # Remove columns
    results = results [[
        "display-name.boot",
        "id.boot",
        "lifecycle-state.boot",
        "size-in-gbs.boot",
        "time-created.boot",
        "display-name.volume_backup_policy"

    ]]

    # Format columns
    results.columns = [
        "Display Name",
        "OCID",
        "Status",
        "Size (GB)",
        "Time Created",
        "Policy"
    ]

    # Add backup volumes to boot volume
    for index_1, row_1 in boot_and_policy.iterrows():
        count = 1
        for index_2, row_2 in boot_backup_volumes.iterrows():
            if row_1["OCID"] == row_2["boot-volume-id.boot_backup_volumes"]:
                boot_and_policy.at[index_1, "Backup " + str(count) + " Usage (GB)"] = row_2["unique-size-in-gbs.boot_backup_volumes"]
                count = count + 1
        count = 1

    return results