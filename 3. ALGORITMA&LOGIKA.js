function jumlahFrekuensiPadaKata(kalimat) {
  const hasil = {};
  const kataArray = kalimat.toLowerCase().split(" "); // split berdasarkan spasi

  for (let index = 0; index < kataArray.length; index++) {
    const e = kataArray[index];
    hasil[e] = (hasil[e] || 0) + 1;
  }

  return hasil;
}

// Contoh pemakaian
const input =
  "Belajar Golang adalah belajar membuat backend yang scalable dengan Golang";
const input2 = "Belajar tiap hari adalah belajar lagi";
console.log(jumlahFrekuensiPadaKata(input));
console.log(jumlahFrekuensiPadaKata(input2));
