<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Peringatan kondisi wilayah</title>
</head>
<body>
    <p>Halo {{ $user->name }},</p>
    <p>Berikut pembaruan kondisi wilayah domisili Anda:</p>
    <ul>
        <li>Provinsi: {{ $region->provinsi }}</li>
        <li>Kota/Kabupaten: {{ $region->kota }}</li>
        <li>Kecamatan: {{ $region->kecamatan }}</li>
        <li>Status: {{ strtoupper($region->status) }}</li>
    </ul>
    @if (!empty($region->description))
        <p>Deskripsi:</p>
        <p>{{ $region->description }}</p>
    @endif
    <p>Terima kasih,</p>
    <p>JogoJagad</p>
</body>
</html>
