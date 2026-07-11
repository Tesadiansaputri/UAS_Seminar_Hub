import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

type Metode = "SAW" | "WP" | "TOPSIS";

interface Kriteria {
  id: number;
  kode: string;
  nama: string;
  jenis: string;
  sumber: string;
}

interface Preference {
  kriteriaId: number;
  bobot: number;
}

const metodeList: Metode[] = [
  "SAW",
  "WP",
  "TOPSIS",
];

const bobotList = [
  0,5,10,15,20,25,30,35,40,45,
  50,55,60,65,70,75,80,85,90,95,100,
];

export default function Recommendation() {

  const navigate = useNavigate();

  const [metode,setMetode] =
    useState<Metode>("SAW");

  const [kriteria,setKriteria] =
    useState<Kriteria[]>([]);

  const [preferences,setPreferences] =
    useState<Preference[]>([]);

  useEffect(()=>{

    getKriteria();

  },[]);

  const getKriteria = async()=>{

    try{

      const res = await api.get("/kriteria");

      setKriteria(res.data);

      setPreferences(

        res.data.map((item:Kriteria)=>({

          kriteriaId:item.id,

          bobot:0

        }))

      );

    }catch(err){

      console.log(err);

    }

  };

    const handleBobot = (
    index:number,
    value:number
  )=>{

    const data=[...preferences];

    data[index].bobot=value;

    setPreferences(data);

  };

  const totalBobot = useMemo(()=>{

    return preferences.reduce(

      (total,item)=>total+item.bobot,

      0

    );

  },[preferences]);

  const handleSubmit = async () => {

  if (totalBobot !== 100) {
    alert("Total bobot harus tepat 100%");
    return;
  }

  try {

    const user = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

    await api.post("/bobot", {

      userId: user.id,

      bobot_harga:
        preferences.find(
          p => kriteria.find(k => k.id === p.kriteriaId)?.nama === "Harga"
        )?.bobot || 0,

      bobot_kuota:
        preferences.find(
          p => kriteria.find(k => k.id === p.kriteriaId)?.nama === "Kuota"
        )?.bobot || 0,

      bobot_rating:
        preferences.find(
          p => kriteria.find(k => k.id === p.kriteriaId)?.nama === "Rating"
        )?.bobot || 0,

      bobot_level:
        preferences.find(
          p => kriteria.find(k => k.id === p.kriteriaId)?.nama === "Level"
        )?.bobot || 0,

      bobot_fasilitas:
        preferences.find(
          p => kriteria.find(k => k.id === p.kriteriaId)?.nama === "Fasilitas"
        )?.bobot || 0,

    });


    
navigate(`/hasil?metode=${metode}`);
  } catch (err) {

    console.log(err);

    alert("Gagal menyimpan bobot.");

  }

};

return (
<div className="min-h-screen bg-gray-100 py-10">

<div className="max-w-5xl mx-auto px-6">

<div className="bg-white rounded-2xl shadow-md p-8 mb-8">

<h1 className="text-3xl font-bold text-red-900">
Preferensi Rekomendasi Seminar
</h1>

<p className="text-gray-600 mt-2">

Silakan pilih metode perhitungan kemudian tentukan bobot kepentingan untuk setiap kriteria.

</p>

</div>
<div className="bg-white rounded-2xl shadow-md p-6 mb-8">

<label className="font-semibold">

Metode Perhitungan

</label>

<select

value={metode}

onChange={(e)=>

setMetode(e.target.value as Metode)

}

className="w-full mt-3 border rounded-lg p-3"

>

{metodeList.map((item)=>(

<option

key={item}

value={item}

>

{item}

</option>

))}

</select>

</div>
<div className="space-y-6">

{kriteria.map((item,index)=>(

<div

key={item.id}

className="bg-white rounded-2xl shadow-md p-6"

>

<h2 className="text-xl font-bold text-red-900">

{item.kode} - {item.nama}

</h2>

<p className="text-gray-500 mt-1">

Jenis :
<b> {item.jenis}</b>

</p>

<p className="text-gray-500 mb-4">

Sumber :
{item.sumber}

</p>

<label className="font-medium">

Bobot Kepentingan

</label>

<select

value={preferences[index]?.bobot}

onChange={(e)=>

handleBobot(index,Number(e.target.value))

}

className="w-full mt-2 border rounded-lg p-3"

>

{bobotList.map((b)=>(

<option

key={b}

value={b}

>

{b}%

</option>

))}

</select>

</div>

))}

</div>

{/* ================= TOTAL BOBOT ================= */}

<div className="mt-8 bg-white rounded-2xl shadow-md p-6">

  <div className="flex justify-between items-center mb-3">

    <h2 className="text-xl font-bold text-red-900">
      Total Bobot
    </h2>

    <span
      className={`text-lg font-bold ${
        totalBobot === 100
          ? "text-green-600"
          : "text-red-600"
      }`}
    >
      {totalBobot}%
    </span>

  </div>

  <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">

    <div
      className={`h-4 transition-all duration-500 ${
        totalBobot === 100
          ? "bg-green-500"
          : "bg-red-700"
      }`}
      style={{
        width: `${Math.min(totalBobot,100)}%`,
      }}
    />

  </div>

  {totalBobot===100 ? (

    <p className="text-green-600 mt-3 font-medium">

      ✓ Total bobot sudah sesuai.

    </p>

  ) : (

    <p className="text-red-600 mt-3 font-medium">

      Total bobot harus tepat 100%.

    </p>

  )}

</div>

{/* ================= RINGKASAN ================= */}

<div className="bg-white rounded-2xl shadow-md p-6 mt-8">

<h2 className="text-xl font-bold text-red-900 mb-5">

Ringkasan Bobot

</h2>

<div className="space-y-3">

{preferences.map((item,index)=>(

<div

key={item.kriteriaId}

className="flex justify-between border-b pb-3"

>

<div>

<p className="font-semibold">

{kriteria[index]?.nama}

</p>

<p className="text-sm text-gray-500">

{kriteria[index]?.jenis}

</p>

</div>

<div className="font-bold text-red-900">

{item.bobot}%

</div>

</div>

))}

</div>

</div>

{/* ================= BUTTON ================= */}

<div className="mt-10">

<button

onClick={handleSubmit}

disabled={totalBobot!==100}

className={`

w-full

py-4

rounded-xl

text-lg

font-bold

transition

${
totalBobot===100

?

"bg-red-900 hover:bg-red-800 text-white"

:

"bg-gray-300 text-gray-500 cursor-not-allowed"

}

`}

>

Cari Rekomendasi

</button>

</div>

</div>
</div>
);
}