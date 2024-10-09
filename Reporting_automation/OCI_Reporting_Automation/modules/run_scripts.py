import modules.extract_meta_data as m_extract_meta_data
import glob

def main():
    print("Running report scripts...")

    allFiles = glob.glob("./report_scripts/*.py")

    list = []

    for files in allFiles:
        list.append("python " + files)

    m_extract_meta_data.concurrent_commands(list)
