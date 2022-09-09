# YÊU CẦU PHÁT TRIỂN

## Version 1.0
- (done) Chuyển cờ  request.directory_home thành request[:directory_home],  request.directory_home.abc => @request[:directory_home][:anb]
- (done) Chuyển == 1 thành .to_i == 1, == 0 thành .to_s == "0"
- (done) Chuyển != "", neq "" thành .present?, == "", eq "" thành .blank?
- (done) Chuyển #?# => #{} với loại khác giao diện
- (done) Chuyển thành dạng cfquery đang dùng
### Version 2
- (done) Sua loi to_s == "0" luon chay ke ca khi khong phai bien request
- (done) Chr(13) => \n \r
- (done) Listappend => <<  ------ (\S+) = (ListAppend|listappend|listAppend|Listappend)\(\1,(.+)\) => $1 << $3 - Chuyển ở cuối
- (done) REReplace(wkStr,"^[ 　]+(.*)","\1") dung regex ------ (ReReplace|rereplace|reREplage|REReplace)\(([^,"\)]+),( |)"([^,]+)",([^,\)]+)\) => $2.sub(/$4/,$5) 
- (done) REReplace(wkStr,"^[ 　]+(.*)","\1","all") dung regex
- (done) Replace(CSVDataCel, "　", " ", "all") ko dung regex ------- (Replace|replace|REplage)\(([^,"]+),([^,]+),([^,\)]+),( |)("all"|"ALL")( |)\) => $2.gsub($3,$4)
- (done) Replace(CSVDataCel, "　", " ", "one") ko dung regex ------- (Replace|replace|REplage)\(([^,"]+),([^,]+),([^,\)]+),( |)("one"|"ONE")( |)\) => $2.sub($3,$4)
 ListFind(db_column_name_list, "hourly_pay_from")
 REFind("\*\*$",tmptmpworkno)
 Find("\*\*$",tmptmpworkno)
- (done) now(), Now(), CreateODBCDateTime(now()) => Time.zone.now
- (done) DateAdd('d', 7, now())
- (done) DateFormat(now(), 'yyyymmdd')
- (done) <cfswitch expression="#enbaito_api#"></cfswitch>
- (done) <cfcase  value="update_list,update"></cfcase>
- (done) .recordcount => .count
- XMLFormat(slct_branch_name) => slct_branch_name