while getopts ":a:s:b:r:" opt; do
  case $opt in
    a) appname="$OPTARG"
    ;;
    s) snapname="$OPTARG"
    ;;
    b) backupname="$OPTARG"
    ;;
    r) reponame="$OPTARG"
    ;;
    \?) echo "Invalid option -$OPTARG" >&2
    ;;
  esac
done

echo
echo "1/3: Creating a snapshot of $appname"
echo
robin snapshot create $appname --snapname $snapname --desc "this snapshot is created automatically with shell script" --wait && echo && robin snapshot list --app emp-mgmt
echo
SNAPID=$(echo `robin snapshot list --app $appname | grep $snapname | cut -c 3-34`)
echo "2/3: Backing up $SNAPID"
echo
robin backup create $appname $reponame --snapshotid $SNAPID --backupname $backupname --wait && echo && robin backup list --app emp-mgmt
echo
echo "3/3: Exporting Backup"
echo
BACKUPID=$(echo `robin backup list --app $appname | grep $backupname | cut -c 3-34`)
robin backup export $BACKUPID && echo
echo "Copy the above sha5 token to import backup elsewhere"