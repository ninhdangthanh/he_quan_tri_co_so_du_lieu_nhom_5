--8
ALTER TABLE SANPHAM ADD CONSTRAINT SANPHAM_GIA CHECK(GIA > 500)

--9
ALTER TABLE HOADON ADD CONSTRAINT SL_MUA CHECK(SL > 1)

--10
ALTER TABLE KHACHHANG ADD CONSTRAINT NGDK_NGSINH CHECK(NGDK > NGSINH)

--11
ALTER TABLE HOADON ADD CONSTRAINT NGHD_NGDK CHECK(HOADON.NGHD > KHACHHANG.NGDK)