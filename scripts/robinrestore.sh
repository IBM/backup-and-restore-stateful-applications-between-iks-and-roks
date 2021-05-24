while getopts ":t:a:" opt; do
  case $opt in
    t) token="$OPTARG"
    ;;
    a) appname="$OPTARG"
    ;;
    \?) echo "Invalid option -$OPTARG" >&2
    ;;
  esac
done

echo
echo "1/2: Importing using the token: $token"
echo
robin backup import $token --wait
echo
robin backup list && echo
BACKUPID=$(echo `robin backup list | grep $appname | cut -c 3-34`)
echo "2/2: Restoring app using Backup: $BACKUPID"
echo
robin app create from-backup $appname $BACKUPID -n demo --wait
echo
robin app list
echo
robin app info $appname --status && echo
echo "Postgresql Connection Details: " && echo

IP_ADDRESS=$(kubectl get service -n demo $appname-t3-db-postgresql -o jsonpath={.spec.clusterIP})
POSTGRES_PASSWORD=$(kubectl get secret --namespace demo $appname-t3-db-postgresql -o jsonpath="{.data.postgresql-password}" | base64 --decode)

echo "Username: postgres"
echo "Password: $POSTGRES_PASSWORD"
echo "Hostname: $IP_ADDRESS"
echo "Port: 5432"