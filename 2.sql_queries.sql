-- Tulis SQL untuk menampilkan 5 artikel terakhir dari user tertentu
--byid
SELECT id, title, body, status, created_at
FROM articles
WHERE user_id = :user_id
ORDER BY created_at DESC
LIMIT 5;

-- by
SELECT a.id, a.title, a.body, a.status, u.username, a.created_at
FROM articles a
JOIN users u ON u.id = a.user_id
WHERE u.username = :user_name
ORDER BY a.created_at DESC
LIMIT 5;


-- Tulis SQL untuk menghitung jumlah artikel published dan draft per user
SELECT 
    u.id AS user_id,
    u.username,
    COUNT(CASE WHEN a.status = 'published' THEN 1 END) AS published_count,
    COUNT(CASE WHEN a.status = 'draft' THEN 1 END) AS draft_count
FROM 
    users u
LEFT JOIN 
    articles a ON u.id = a.user_id
GROUP BY 
    u.id, u.username
ORDER BY 
    u.id;

-- Sebutkan minimal 2 cara optimasi jika query lambat:

-- 1. buat index di query yang sering digunakan
        CREATE INDEX idx_articles_user_id ON articles(user_id);
        CREATE INDEX idx_articles_status ON articles(status);
        CREATE INDEX idx_articles_created_at ON articles(created_at);
        CREATE INDEX idx_articles_title ON articles(title);

        --bisa juga digabung index jika sering digabungkan menggunakan or atau and dengan order by
        CREATE INDEX idx_articles_user_status_created
        ON articles(user_id, status, created_at DESC);
        --kusus seach pake ILIKE gunakan gin
        -- Aktifkan ekstensi pg_trgm (sekali saja)
        CREATE EXTENSION IF NOT EXISTS pg_trgm;

        -- Buat index GIN untuk field title
        CREATE INDEX idx_articles_title_trgm ON articles USING GIN (title gin_trgm_ops);
        -- atau bisa di lowercase terlebih dahulu sebelum mencari sesauikan body atau query dengan lowercase
        SELECT * FROM articles WHERE LOWER(title) LIKE '%golang%';



-- 2. Use query optimization techniques
    -- A.Gunakan EXPLAIN ANALYZE untuk mengidentifikasi bagian query yang lambat
        -- example:
        -- EXPLAIN ANALYZE
        -- SELECT * FROM articles WHERE user_id = 1 AND status = 'published' ORDER BY created_at DESC;
    -- B.Batasi hasil query dan gunakan pagination
    -- C.Gunakan strategi JOIN yang tepat
        -- Daripada mengambil data secara terpisah dari beberapa tabel, lebih baik gunakan JOIN untuk mengambil data terkait dalam satu query.
        SELECT 
            a.id, a.title, a.status, a.created_at,
            u.username, u.email
        FROM 
            articles a
        INNER JOIN 
            users u ON a.user_id = u.id
        WHERE 
            a.user_id = :user_id
        ORDER BY 
            a.created_at DESC
        LIMIT 10 OFFSET :offset;