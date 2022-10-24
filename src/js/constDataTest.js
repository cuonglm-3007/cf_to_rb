export const DATA_TEST = `
<cfquery name="insPInfoAccessLog" datasource="#request.dsn#">
INSERT INTO t_p_info_access_log(
    access_ip,
    access_file,
    success_flg,
    access_mode,
    creater,
    create_dt
)
VALUES(
    <cfqueryparam cfsqltype="CF_SQL_VARCHAR" value="#tmp_ip#">,
    <cfqueryparam cfsqltype="CF_SQL_VARCHAR" value="#csv_file_name#">,
    <cfqueryparam cfsqltype="CF_SQL_INTEGER" value="0">,
    <cfqueryparam cfsqltype="CF_SQL_INTEGER" value="1">,
    <cfqueryparam cfsqltype="CF_SQL_INTEGER" value="#request.adminid#" null="#(request.adminid is "")?'yes':'no'#">,
    <cfqueryparam cfsqltype="CF_SQL_TIMESTAMP" value="#CreateODBCDateTime(now())#">
)
</cfquery>

`;
