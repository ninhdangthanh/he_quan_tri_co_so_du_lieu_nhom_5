--Bài 1: 
--➢ Ràng buộc khi thêm mới nhân viên thì mức lương phải lớn hơn 15000, nếu vi phạm thì
--xuất thông báo “luong phải >15000’
go
create trigger Bai1_1 on NhanVien
for insert
as
	if (select luong from inserted) < 15000
		begin
			print 'Luong phai > 15000'
			rollback transaction
		end

go

go
INSERT INTO NHANVIEN VALUES (N'Võ', N'Hoài' , N'Thanh', '010' , N'2002/12/11' , N' Tp HCM', N'Nam', 100, '005' ,1 )
go

--➢ Ràng buộc khi thêm mới nhân viên thì độ tuổi phải nằm trong khoảng 18 <= tuổi <=65.
go
create trigger Bai1_2 on NhanVien
for insert
as
	declare @age int
	set @age = YEAR(GETDATE()) - (select YEAR(NgSinh) from inserted)
	if (@age < 18 or @age > 65)
		begin
			print 'Tuoi nhan vien khong hop le'
			rollback transaction
		end
go

go
INSERT INTO NHANVIEN VALUES (N'Võ', N'Hoài' , N'Thanh', '010' , N'2002/12/11' , N' Tp HCM', N'Nam', 100, '005' ,1 )
go

--➢ Ràng buộc khi cập nhật nhân viên thì không được cập nhật những nhân viên ở TP HCM
go
create trigger Bai1_3 on NhanVien
for Update
as
	if(select dchi from deleted) like '%HCM'
		begin
			print 'Dia chi khong hop le'
			rollback transaction
		end
go

go
UPDATE NHANVIEN SET TENNV ='nguyen' where MANV ='009'
go

--Bài 2: 
--Viết các Trigger AFTER:
--➢ Hiển thị tổng số lượng nhân viên nữ, tổng số lượng nhân viên nam mỗi khi có hành động
--thêm mới nhân viên.
go
create trigger insertNhanVien_Bai2_1 on NhanVien
after insert
as
begin
	select COUNT(case when UPPER(phai) = 'Nam' then 1 end) Nam,
		   COUNT(case when UPPER(phai) = N'Nữ' then 1 end) Nữ
	from NHANVIEN
end
go

go
INSERT INTO NHANVIEN VALUES (N'Võ', N'Hoài' , N'Thanh', '010' , N'2002/12/11' , N' Tp HCM', N'Nam', 100, '005' ,1 )
go

--➢ Hiển thị tổng số lượng nhân viên nữ, tổng số lượng nhân viên nam mỗi khi có hành động
--cập nhật phần giới tính nhân viên
go
create trigger updateNhanVien_Bai2_2 on NhanVien
after update
as
begin
	if UPDATE(phai)
		begin
			select COUNT(case when UPPER(phai) = 'Nam' then 1 end) Nam,
				   COUNT(case when UPPER(phai) = N'Nữ' then 1 end) Nữ
			from NHANVIEN
		end
end
go

go
  UPDATE NHANVIEN SET PHAI ='Nam' where MANV ='006'
go

--➢ Hiển thị tổng số lượng đề án mà mỗi nhân viên đã làm khi có hành động xóa trên bảng
--DEAN
go
create trigger CountDeAn_Bai2_3 on DeAn
after delete
as
	begin
		select Ma_NVien, COUNT(MADA) as 'so luong' from PHANCONG
		group by MA_NVIEN
	end

select * from DEAN
go

go
delete DEAN where MADA = 5
go

--Bài 3:
--Viết các Trigger INSTEAD OF
--➢ Xóa các thân nhân trong bảng thân nhân có liên quan khi thực hiện hành động xóa nhân
--viên trong bảng nhân viên.
go
create trigger delete_THANNHAN_NV_Bai3_1 on NhanVien
instead of delete
as
begin
	delete from THANNHAN where MA_NVIEN in (select MaNV from deleted)
	delete from NHANVIEN where MANV in (select MaNV from deleted)
end
go

go
delete NHANVIEN WHERE MANV ='012'
go

--➢ Khi thêm một nhân viên mới thì tự động phân công cho nhân viên làm đề án có MADA
--là 1.
go
create trigger insertNhanVien_Bai3_2 on NhanVien
after insert
as begin
	insert into PHANCONG values ((select MANV from inserted),1,1,99)
end
go

go
INSERT INTO NHANVIEN VALUES (N'Võ', N'Hoài' , N'Thanh', '010' , N'2002/12/11' , N' Tp HCM', N'Nam', 100, '005' ,1 )
go