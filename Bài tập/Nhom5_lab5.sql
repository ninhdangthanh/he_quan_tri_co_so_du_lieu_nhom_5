--1a
--tạo sp_XinChao
create proc sp_XinChao
	@Ten nvarchar(30)
as
Begin 
	Print  'Xin Chào ' + @Ten;
End;
Exec sp_XinChao N'Hoài Thanh';

--1b--------------------------------
create proc sp_sum
	@s1 int,@s2 int
as
begin 
	declare @tg int;
	set @tg = @s1 + @s2;
	print N'Tổng là: ' + cast(@tg as varchar);
end;

exec sp_sum 5,6;

--1c-------------------------------------------

create proc sp_sumChan
	@n int
as
begin 
	declare @sum int,@i int;
	set @sum = 0;
	set @i = 1;
	while @i <= @n
	begin
		if @i %2 = 0
		begin
			set @sum = @sum + @i;
		end;

		set @i = @i + 1;
	end;
	print N'Tổng các số chẵn: ' + cast(@sum as varchar);
end;
exec sp_sumChan 20
-----1d----------------------------------
create proc sp_uocchung
	@a int, @b int
as
begin
	declare @temp int
	if @a > @b
	begin
		select @temp = @a,@a = @b,@b = @temp
	end
	while @b % @a != 0
	begin
		select @temp = @a,@a = @b % @a, @b = @temp
	end
	print N'Ước số chung lớn nhất: '+cast(@a as varchar)
end
exec sp_uocchung 20,9

--2a
create proc sp_ThongTinNV
	@MaNV nvarchar(10)
as
begin
	select * from NHANVIEN 
	where MANV like '' + @MaNV
end;

exec sp_ThongTinNV '1'

--2b
create proc sp_tongnvtgdean
	@MaDa int
as
begin
	select count(MA_NVIEN) as 'so luong nv' from PHANCONG where MADA = @MaDa
end;

exec [sp_tongnvtgdean] 2
---2c
create proc sp_thongkenvdean
	@MaDa int, @DDiem_DA nvarchar(15)
as
begin
	select count(b.MA_NVIEN) as 'so luong nv' from DEAN a inner join PHANCONG b on a.MADA = b.MADA 
	where a.MADA = @MaDa and a.DDIEM_DA = @DDiem_DA
	end;

exec [sp_thongkenvdean] 1,N'Vũng Tàu'
----2d
create proc sp_TimnvtheoTP
	@TrPHG nvarchar(15)
as
begin
	select b.* from PHONGBAN a inner join NHANVIEN b on a.MAPHG = b.PHG
	where a.TRPHG = @TrPHG and not exists (select * from THANNHAN where MANV = b.MANV)
	end;
exec [sp_TimnvtheoTP] '005'
-----2d
create proc sp_kiemtranvthuocphong
	@MaNV nvarchar(15),@MaPB int
as
begin
	declare @dem int;
	select @dem = count(@MaNV) from NHANVIEN where MANV = @MaNV and PHG = @MaPB
	return @dem
end;
declare @result int;
exec @result = [dbo].[sp_kiemtranvthuocphong] '005', 5
select @result

--3a
create proc sp_ThemPhongBanMoi
	@TenPhg nvarchar(20),
	@MaPhg int,
	@TrPhg nvarchar(10),
	@Ng_NhanChuc date
as
begin
	if exists(select * from PHONGBAN where MAPHG = @MaPhg)
	begin
		print N'Mã phòng ban đã tồn tại'
	end

	insert into PHONGBAN (
		[TENPHG]
      ,[MAPHG]
      ,[TRPHG]
      ,[NG_NHANCHUC]
	) values
	(@TenPhg, @MaPhg, @TrPhg, @Ng_NhanChuc)

end;

exec sp_ThemPhongBanMoi 'CNTT', 15, '005', '2002-05-05'

--3b
create proc sp_CapNhatPhongBan
	@OldTenPhg nvarchar(15),
	@TenPhg nvarchar(20),
	@MaPhg int,
	@TrPhg nvarchar(10),
	@Ng_NhanChuc date
as
begin
	
	update PHONGBAN 
	set
		[TENPHG] = @TenPhg
		,[MAPHG] = @MaPhg
		,[TRPHG] = @TrPhg
		,[NG_NHANCHUC] = @Ng_NhanChuc
	where TENPHG = @OldTenPhg

end;


exec sp_CapNhatPhongBan 'CNTT', 'IT' , 15, '005', '2002-05-05'

select * from PHONGBAN