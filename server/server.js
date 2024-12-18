const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

console.log('port::', port)

app.use(cors({
  origin: [
    'https://9fa1-211-44-196-81.ngrok-free.app',
    'http://localhost:5173',
     'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning'],
}));

app.use(express.json());

// SQLite 데이터베이스 연결
const db = new sqlite3.Database('./test.db', (err) => {
  if (err) {
    console.error('Error opening database', err);
  } else {
    console.log('Database connected');
    
    // 테이블 생성
    db.run(`CREATE TABLE IF NOT EXISTS items (
      id TEXT PRIMARY KEY,
      imageUrl TEXT NOT NULL,
      imageName TEXT NOT NULL,
      price INTEGER NOT NULL,
      name TEXT NOT NULL,
      link TEXT NOT NULL
    )`, (err) => {
      if (err) {
        console.error('Error creating table', err);
      } else {
        console.log('Table created or already exists');
      }
    });
  }

   // 초기 데이터 삽입
   db.run(`INSERT OR IGNORE INTO items (id, imageUrl, imageName, price, name, link) VALUES 
    ('1', 'https://www.striderkorea.com/data/file/bod_11/3076632019_YmrivRI2_161662b99f75f1e6b3ceed3e48266659738e6d25.jpg', '스트라이더 12인치 스포츠 밸런스 바이크', 170000, '', 'https://www.striderkorea.com/bbs/board.php?bo_table=bod_11&wr_id=80'),
    ('2', 'https://contents.lotteon.com/itemimage/20240429110919/LO/21/26/28/82/26/_2/12/62/88/22/7/LO2126288226_2126288227_1.jpg', '[마이리틀타이거] 블록테이블', 60000 , '', 'https://www.kurly.com/goods/5057248'),
    ('3', 'https://sitem.ssgcdn.com/92/27/50/item/2097001502792_i3_750.jpg', '[마이리틀타이거] 블록 점보 비행기', 45000, '', 'https://www.ssg.com/item/itemView.ssg?itemId=2097001502792'),
    ('4', 'https://sitem.ssgcdn.com/62/71/32/item/1000275327162_i1_750.jpg', '로보카폴리 폴리 변신로봇 디럭스 5인치', 20000, '', 'https://emart.ssg.com/item/itemView.ssg?itemId=1000544482508&siteNo=6001&salestrNo=6005'),
    ('5', 'https://sitem.ssgcdn.com/18/66/48/item/1000618486618_i1_1200.jpg', 'ROITOYS 로보카폴리 미니카 로이', 6300, '', 'https://emart.ssg.com/item/itemView.ssg?itemId=1000618486618&siteNo=6001&salestrNo=6005&tlidSrchWd=%EB%A1%9C%EB%B3%B4%EC%B9%B4%ED%8F%B4%EB%A6%AC%EB%A1%9C%EC%9D%B4&srchPgNo=1'),
    ('6', 'https://thumbnail10.coupangcdn.com/thumbnails/remote/492x492ex/image/retail/images/2024/10/01/18/3/bf5460e0-d93b-4ce6-8610-b4124f230d60.jpg', 'ROITOYS 로보카폴리 미니카 폴리', 6300, '', 'https://fallcent.com/product/?product_id=8373815259&item_id=24197836748'),
    ('7', 'https://thumbnail9.coupangcdn.com/thumbnails/remote/1500x1500ex/image/vendor_inventory/1893/304731aa0d14b761d1bf9e10435b53b954f9f4b005256c2436247054787d.jpg', '유아 어린이 밸런스보드', 22800, '', 'https://www.coupang.com/vp/products/7677270020?itemId=20496590786&vendorItemId=87564655977&src=1032034&spec=10305199&addtag=400&ctag=7677270020&lptag=I20496590786&itime=20241211144946&pageType=PRODUCT&pageValue=7677270020&wPcid=17294896192118330123653&wRef=m.danawa.com&wTime=20241211144946&redirect=landing&mcid=d3ef17cb51f4404582d8b777f8cbcf29'),
    ('8', 'https://sitem.ssgcdn.com/68/37/08/item/1000567083768_i1_1200.jpg', '춤추는트리인형', 14770  , '', 'https://www.ssg.com/item/itemView.ssg?itemId=1000567083768&siteNo=6004&salestrNo=6005&tlidSrchWd=%EC%B6%A4%EC%B6%94%EB%8A%94%ED%8A%B8%EB%A6%AC%EC%9D%B8%ED%98%95&srchPgNo=1&src_area=ssglist'),
    ('9', 'https://sitem.ssgcdn.com/77/10/35/item/1000040351077_i1_1200.jpg', '하뚱세이카드(영어/낱말카드)', 18610  , '', 'https://emart.ssg.com/item/itemView.ssg?itemId=1000040351077&siteNo=6001&salestrNo=6005'),
    ('10', 'https://pororomall.com/web/product/big/202008/edec531159dec8e157a4b143f5ae47f6.jpg', '뽀로로 코딩 컴퓨터', 88900, '', 'https://pororomall.com/product/%EB%BD%80%EB%A1%9C%EB%A1%9C-%EC%BD%94%EB%94%A9-%EC%BB%B4%ED%93%A8%ED%84%B0/3195/')`)
  });

// 전체 아이템 목록 조회 API
app.get('/api/items', (req, res) => {
  db.all('SELECT * FROM items', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    res.json(rows)
  })
})

// 특정 ID의 아이템 상세페이지 조회 API
app.get('/api/items/:id', (req, res) => {
  const id = req.params.id
  db.get('SELECT * FROM items WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    if (!row) {
      res.status(404).json({ error: 'Item not found' })
      return
    }
    res.json(row)
  })
})

// 찜하기 name 업데이트 API
app.put('/api/items/:id/name', (req, res) => {
  const id = req.params.id
  const { name } = req.body
  
  db.run('UPDATE items SET name = ? WHERE id = ?', [name, id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    res.json({ message: 'Name updated successfully' })
  })
})



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});