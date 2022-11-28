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