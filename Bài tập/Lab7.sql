-----Câu1 a)------
create function FN_Age(@MaNV nvarchar(9))
	returns int
as
begin 
	returns(
		select DATEDIFF(year, NGSINH , GETDATE())+ 1 from NHANVIEN where MANV =@MaNV);
end;

-----Câu1 b)------
create function FN_TongSoDeAn(
		@MaNV nvarchar(9)
	return int
as
begin
	return (select count(mada) from PHANCONG where MA_NVIEN=@MaNV);
end;

------Câu1 c)------
create function FN_ThongKePhai(
	@Phai nvarchar(3)
	)
	returns int
as
begin
	return(select count(manv) from NHANVIEN where PHAI =@Phai;
end

------Câu1 d)------
alter function FN_ThongTinPhongDeAn
	(@MaPhg int)
	return @List table (TenPhong nvarchar(15),TenTruongPhong nvarchar(30),SoLuongDeAn int)
as 
begin
	insert into @List 
		select a.TENPHG,b.HONV+' '+b.TENLOT+' '+b.TENNV,
			(select count(c.MADA) from DEAN c where c.PHONG =a.MAPHG)
			from PHONGBAN a inner join NHANVIEN b on a.TRPHG = b.MANV
	return;
end;
-------Câu2 a)------
SELECT TOP (1000) [HONV]
		,[TENNV]
		,[TENPHG]
		,[DIADIEM]
	FROM [QLDA].[dbo].[ThongTinNVPhong]

-------Câu2 b)-------
SELECT TOP (1000) [TENNV]
		,[LUONG]
		,[Tuoi]
	FROM [QLDA].[dbo].[NhanVienLuongTuoi]

-------Câu2 c)--------
CREATE VIEW PhongBanDongNhat
as
	select a.TENPHG,
	b.HONV+' '+b.TENLOT+' '+b.TENNV as 'TenTruongPhong'
	from PHONGBAN a inner join NHANVIEN b on a.TRPHG = b.MANV
	where a.MAPHG in (
		select PHG from NHANVIEN
		group by phg
		having count (manv)=
			(select top 1 count (manv) as NVCount from NHANVIEN
				group by phg
				order by NVCount desc)
				)