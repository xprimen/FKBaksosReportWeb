"use client";
import FormTransaksi from "@/components/FormTransaksi";
import {
  transaksiColumns,
  transaksiFilterColumns,
} from "@/components/TableTrasnsaksi/transaksiColumns";
import { DataTable } from "@/components/ui/data-table";
import { getTransaksi } from "@/context/actions";
import { AppContext } from "@/context/context";
import { ActionTypes } from "@/context/reducer";
import { numberToString } from "@/helpers/common";
import { TTransaksi } from "@/helpers/types";
import { Info } from "lucide-react";
import moment from "moment";
import { useSearchParams } from "next/navigation";
import { useContext, useEffect } from "react";
import { utils, writeFileXLSX } from "xlsx";

export default function Page() {
  const {
    state: { transaksi },
    dispatch,
  } = useContext(AppContext);

  const query = useSearchParams();

  useEffect(() => {
    getTransaksi(dispatch);
  }, [dispatch]);

  const handleExport = () => {
    const headings = [
      ["", "", "", "", transaksi.title, "", ""],
      [
        "NO",
        "NAMA",
        "MAWIL",
        "IURAN TERAKHIR",
        "TGL IURAN",
        "JUMLAH",
        "KETERANGAN",
      ],
    ];
    const wb = utils.book_new();
    const ws = utils.json_to_sheet([]);
    const newData = transaksi.data.map((d) => ({
      ["No"]: d.nomor,
      ["Nama"]: d.nama,
      ["Mawil"]: d.mawil,
      ["Iuran Terakhir"]: "",
      ["Tgl Iuran"]: moment(d.tgl_iuran).format("D.M.YY"),
      ["Jumlah"]: d.jumlah,
      ["Keterangan"]: d.keterangan,
    }));
    utils.sheet_add_aoa(ws, headings);
    utils.sheet_add_json(ws, newData, {
      origin: "A3",
      skipHeader: true,
    });
    utils.book_append_sheet(wb, ws, transaksi.title);
    writeFileXLSX(wb, `Transaksi ${transaksi.title}.xlsx`);
  };

  const transformData = (data: TTransaksi[]) => {
    return data.map((d) => ({
      ...d,
      tgl_iuran: moment(d.tgl_iuran).format("D.M.YY"),
      jumlah: numberToString(d.jumlah),
      iuran_terakhir:
        Number(d.iuran_terakhir) > 0
          ? numberToString(Number(d.iuran_terakhir))
          : null,
    })) as TTransaksi[];
  };

  return (
    <>
      {query.get("notif") && (
        <div className="container mx-auto py-4">
          <div className="alert alert-info">
            <Info />
            <span>{query.get("notif")}</span>
          </div>
        </div>
      )}
      <div className="container mx-auto py-4">
        <div className="flex w-full">
          <FormTransaksi />
        </div>
        <div className="bg-base-100 rounded-md shadow-md">
          <div className="overflow-x-auto flex flex-col ">
            <div className="flex flex-row justify-between items-center p-4">
              <h2 className="text-xl font-bold">Transaksi {transaksi.title}</h2>
              <div className="flex flex-row items-center justify-between gap-4">
                <button
                  className="btn btn-sm btn-warning"
                  onClick={() => {
                    // dispatch({ type: ActionTypes.LoadingAnggota });
                    if (
                      confirm("Yakin Akan Menghapus Semua Data Transaksi???")
                    ) {
                      dispatch({
                        type: ActionTypes.CleanTransaksi,
                      });
                      setTimeout(() => {
                        getTransaksi(dispatch);
                      }, 2000);
                    }
                  }}
                >
                  Clean
                </button>
                <button
                  className="btn btn-sm btn-success"
                  onClick={handleExport}
                >
                  Export Xlxs
                </button>
              </div>
            </div>
            <DataTable
              idTable="data-transaksi"
              loading={transaksi.loading}
              columns={transaksiColumns(transaksi.title, dispatch)}
              data={transformData(transaksi.data)}
              filterCol={transaksiFilterColumns}
            />
          </div>
        </div>
      </div>
    </>
  );
}
