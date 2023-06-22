"use client";
import Head from "next/head";
import { Fragment, useContext, useEffect } from "react";
import { utils, writeFile } from "xlsx";
import FormAnggota from "../../components/FormAnggota";
import Navbar from "../../components/Navbar";
import {
  anggotaFilterColumns,
  columns,
} from "../../components/TableAnggota/columns";
import { DataTable } from "../../components/ui/data-table";
import { getAnggota } from "../../context/actions";
import { AppContext } from "../../context/context";
import { useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle, Info } from "lucide-react";
import { ActionTypes } from "../../context/reducer";

function Anggota() {
  const {
    state: { anggota },
    dispatch,
  } = useContext(AppContext);

  const query = useSearchParams();

  useEffect(() => {
    getAnggota(dispatch);
  }, [dispatch]);

  const handleExport = () => {
    const headings = [["NO", "NAMA", "MAWIL"]];
    const wb = utils.book_new();
    const ws = utils.json_to_sheet([]);
    const newData = anggota.data.map((d) => ({
      nomor: d.nomor,
      nama: d.nama,
      mawil: d.mawil,
    }));
    utils.sheet_add_aoa(ws, headings);
    utils.sheet_add_json(ws, newData, { origin: "A2", skipHeader: true });
    utils.book_append_sheet(wb, ws, "Data Anggota");
    writeFile(wb, "Data Anggota.xlsx");
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
        <div className="mb-8">
          <div className="collapse rounded-md bg-base-100 shadow-md">
            <input type="checkbox" />
            <div className="collapse-title text-xl font-medium">
              Klik untuk Upload Data Anggota
            </div>
            <div className="collapse-content">
              <FormAnggota />
            </div>
          </div>
        </div>
        <div className="bg-base-100 rounded-md shadow-md">
          <div className="overflow-x-auto flex flex-col ">
            <div className="flex flex-row justify-between items-center p-4">
              <h2 className="text-xl font-bold">Daftar Anggota Baksos</h2>
              <div className="flex flex-row items-center justify-between gap-4">
                <button
                  className="btn btn-sm btn-warning"
                  onClick={() => {
                    // dispatch({ type: ActionTypes.LoadingAnggota });
                    if (confirm("Yakin Akan Menghapus Semua Data Anggota???")) {
                      dispatch({
                        type: ActionTypes.SuccessCleanAnggota,
                      });
                      setTimeout(() => {
                        getAnggota(dispatch);
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
              idTable="data-anggota"
              loading={anggota.loading}
              columns={columns}
              data={anggota.data}
              filterCol={anggotaFilterColumns}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Anggota;
