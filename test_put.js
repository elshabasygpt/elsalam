const http = require('http');

const data = JSON.stringify({
    name: "محل الصقور",
    storeType: "سوبرماركت",
    mainPhone: "0150175002",
    storeImage: "/uploads/crm/test.png"
});

const req = http.request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/admin/crm/clients/3',
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        // I won't have session cookie easily... this might fail with 401 Unauthorized
    }
}, res => {
    let raw = "";
    res.on('data', c => raw += c);
    res.on('end', () => console.log(res.statusCode, raw));
});

req.on('error', console.error);
req.write(data);
req.end();
