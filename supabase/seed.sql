-- ============================================================
-- seed.sql  (72 race_items, 33 god_items, 47 school_items,
--            27 supplement_items, 56 house_rule_items,
--            4 original_items,
--            8 regulation_items, 7 item_regulations)
-- ============================================================

-- --------------------------------------------------------
-- race_items (72 rows)
-- --------------------------------------------------------
INSERT INTO race_items (id, name, race_type, url, is_always) VALUES
(1,  '人間',                    ARRAY['human'],                  '',                                                                         true),
(2,  'エルフ',                  ARRAY['human'],                  '',                                                                         true),
(3,  'スノウエルフ',            ARRAY['human'],                  '',                                                                         false),
(4,  'ミストエルフ',            ARRAY['human'],                  '',                                                                         true),
(5,  'ドワーフ',                ARRAY['human'],                  '',                                                                         true),
(6,  'ダークドワーフ',          ARRAY['human'],                  '',                                                                         true),
(7,  'タビット',                ARRAY['human'],                  '',                                                                         true),
(8,  'タビット(パイカ種)',      ARRAY['human'],                  '',                                                                         true),
(9,  'タビット(リパス種)',      ARRAY['human'],                  '',                                                                         true),
(10, 'ルーンフォーク',          ARRAY['human'],                  '',                                                                         true),
(11, 'ルーンフォーク(護衛型)', ARRAY['human'],                  '',                                                                         false),
(12, 'ルーンフォーク(戦闘型)', ARRAY['human'],                  '',                                                                         false),
(13, 'ナイトメア',              ARRAY['human'],                  '',                                                                         true),
(14, 'リカント',                ARRAY['human'],                  '',                                                                         true),
(15, 'リカント(大型草食獣)',    ARRAY['human'],                  '',                                                                         true),
(16, 'リカント(小型草食獣)',    ARRAY['human'],                  '',                                                                         true),
(17, 'リルドラケン',            ARRAY['human'],                  '',                                                                         true),
(18, 'リルドラケン(小翼種)',    ARRAY['human'],                  '',                                                                         false),
(19, 'リルドラケン(有毛種)',    ARRAY['human'],                  '',                                                                         true),
(20, 'グラスランナー',          ARRAY['human'],                  '',                                                                         true),
(21, 'グラスランナー(アリーシャ)', ARRAY['human'],              '',                                                                         true),
(22, 'グラスランナー(クリメノス)', ARRAY['human'],              '',                                                                         true),
(23, 'メリア',                  ARRAY['human'],                  '',                                                                         true),
(24, 'メリア(カーニバラス)',    ARRAY['human'],                  '',                                                                         false),
(25, 'メリア(ファンギー)',      ARRAY['human'],                  '',                                                                         false),
(26, 'ティエンス',              ARRAY['human'],                  '',                                                                         true),
(27, 'ティエンス(機解種)',      ARRAY['human'],                  '',                                                                         true),
(28, 'ティエンス(魔解種)',      ARRAY['human'],                  '',                                                                         false),
(29, 'レプラカーン',            ARRAY['human'],                  '',                                                                         true),
(30, 'レプラカーン(放浪種)',    ARRAY['human'],                  '',                                                                         false),
(31, 'レプラカーン(探索種)',    ARRAY['human'],                  '',                                                                         false),
(32, 'アルヴ',                  ARRAY['human'],                  '',                                                                         true),
(33, 'シャドウ',                ARRAY['human'],                  '',                                                                         true),
(34, 'ソレイユ',                ARRAY['human'],                  '',                                                                         true),
(35, 'スプリガン',              ARRAY['human'],                  '',                                                                         true),
(36, 'アビスボーン',            ARRAY['human'],                  '',                                                                         true),
(37, 'ハイマン',                ARRAY['human'],                  '',                                                                         true),
(38, 'フロウライト',            ARRAY['human'],                  '',                                                                         true),
(39, 'フィー',                  ARRAY['human'],                  '',                                                                         false),
(40, 'ミアキス',                ARRAY['human'],                  '',                                                                         true),
(41, 'ヴァルキリー',            ARRAY['human'],                  '',                                                                         false),
(42, 'センティアン(ルミエル)', ARRAY['human'],                  '',                                                                         false),
(43, 'センティアン(カルディア)', ARRAY['human'],                '',                                                                         false),
(44, 'ノーブルエルフ',          ARRAY['human'],                  '',                                                                         false),
(45, 'マナフレア',              ARRAY['human'],                  '',                                                                         false),
(46, '魔道天使',                ARRAY['human'],                  '',                                                                         false),
(47, 'ウィークリング(ガルーダ)', ARRAY['barbaros'],             '',                                                                         true),
(48, 'ウィークリング(タンノズ)', ARRAY['barbaros'],             '',                                                                         true),
(49, 'ウィークリング(バジリスク)', ARRAY['barbaros'],           '',                                                                         true),
(50, 'ウィークリング(ミノタウロス)', ARRAY['barbaros'],         '',                                                                         true),
(51, 'ウィークリング(マーマン)', ARRAY['barbaros'],             '',                                                                         true),
(52, 'ドレイク',                ARRAY['barbaros'],               '',                                                                         false),
(53, 'バジリスク',              ARRAY['barbaros'],               '',                                                                         false),
(54, 'ディアボロ',              ARRAY['barbaros'],               '',                                                                         false),
(55, 'ダークトロール',          ARRAY['barbaros'],               '',                                                                         false),
(56, 'アルボル',                ARRAY['barbaros'],               '',                                                                         true),
(57, 'バーバヤガー',            ARRAY['barbaros'],               '',                                                                         false),
(58, 'ケンタウロス',            ARRAY['barbaros'],               '',                                                                         false),
(59, 'シザースコーピオン',      ARRAY['barbaros'],               '',                                                                         false),
(60, 'ドーン',                  ARRAY['barbaros'],               '',                                                                         true),
(61, 'コボルト',                ARRAY['barbaros'],               '',                                                                         false),
(62, 'ラミア',                  ARRAY['barbaros'],               '',                                                                         false),
(63, 'ラルヴァ',                ARRAY['barbaros'],               '',                                                                         true),
(64, 'リザードマン',            ARRAY['barbaros'],               '',                                                                         false),
(65, 'ライカンスロープ',        ARRAY['barbaros'],               '',                                                                         false),
(66, 'バルカン',                ARRAY['barbaros'],               '',                                                                         false),
(67, 'センティアン(イグニス)', ARRAY['barbaros'],               '',                                                                         false),
(68, 'カレイド',                ARRAY['demon','maginery'],       'https://lite.evernote.com/note/7149f164-8e6a-8a84-d26c-b729e4384145',     true),
(69, 'ブロタール',              ARRAY['mysthicalBeast'],         'https://lite.evernote.com/note/1653ce4f-2711-4cbc-afa4-ada4f5e592d1',     true),
(70, 'ムシュフシュ',            ARRAY['mysthicalBeast'],         'https://lite.evernote.com/note/c9ed21f8-7c92-92fc-5422-d10c11af20ac',     true),
(71, 'ギーブル',                ARRAY['mysthicalBeast'],         'https://lite.evernote.com/note/2ddb5e1f-1b72-a1c8-79cd-ea0c87fc4e67',     true),
(72, 'レイヴン',                ARRAY['barbaros'],               'https://lite.evernote.com/note/de5ce476-dbfb-55ec-643d-1219cac4775c',     true);

-- --------------------------------------------------------
-- god_items (33 rows)
-- --------------------------------------------------------
INSERT INTO god_items (id, type, name, url, is_always) VALUES
(1,  1, 'ライフォス',     '', true),
(2,  1, 'ティダン',       '', true),
(3,  1, 'アステリア',     '', true),
(4,  1, 'グレンダール',   '', true),
(5,  1, 'ガメル',         '', true),
(6,  1, 'シーン',         '', true),
(7,  1, 'イーヴ',         '', true),
(8,  1, 'ハルーラ',       '', true),
(9,  1, 'ダリオン',       '', false),
(10, 1, 'ミリッツァ',     '', true),
(11, 1, 'ミィルズ',       '', true),
(12, 1, 'アールマータ',   '', true),
(13, 1, 'フルシル',       '', true),
(14, 1, 'ストラスフォード', '', true),
(15, 1, 'サドゥール',     '', true),
(16, 1, 'カグツ',         '', true),
(17, 1, 'ドレイヴェン',   '', true),
(18, 3, 'キルヒア',       '', true),
(19, 3, 'ミルタバル',     '', true),
(20, 3, 'パロ',           '', true),
(21, 3, 'アーデニ',       '', true),
(22, 3, 'クレ',           'https://yutorize.work/ytsheet/sw2.5/?id=lufbkk', true),
(23, 3, 'マール',         'https://yutorize.work/ytsheet/sw2.5/?id=rYXZgc', true),
(24, 2, 'ダルクレム',     '', false),
(25, 2, 'エイリャーク',   '', false),
(26, 2, 'ツァイデス',     '', false),
(27, 2, 'ラーリス',       '', false),
(28, 2, 'ニバセプス',     '', false),
(29, 2, 'グルヴァゾ',     '', false),
(30, 2, 'ゾラス=バレス', '', false),
(31, 2, 'メイガル',       '', false),
(32, 2, 'ドゥブルーク',   '', true),
(33, 2, 'テケルロコ',     '', true);

-- --------------------------------------------------------
-- school_items (47 rows)
-- --------------------------------------------------------
INSERT INTO school_items (id, name, url, is_always, notes) VALUES
(1,  '『七色のマナ』特別魔法行使学',             '', true,  ''),
(2,  'イーヴァル狂闘術',                         '', true,  ''),
(3,  'ミハウ式流円闘技',                         '', true,  ''),
(4,  'カスロット豪砂拳・バタス派',               '', false, ''),
(5,  'マカジャハット・プロ・グラップリング',     '', true,  ''),
(6,  'ナルザラント柔盾活用術',                   '', true,  ''),
(7,  'アースト強射術',                           '', true,  ''),
(8,  'ヒアデム魔力流転操撃',                     '', true,  ''),
(9,  '古モルガナンシン王国式戦域魔導術',         '', true,  ''),
(10, 'ダイケホーン双霊氷法',                     '', true,  ''),
(11, 'スホルテン騎乗戦技',                       '', true,  ''),
(12, 'アードリアン流古武道・メルキアノ道場',     '', true,  ''),
(13, 'エルエレナ惑乱操布術',                     '', true,  ''),
(14, 'ファイラステン古流ヴィンド派(双剣の型)',   '', true,  ''),
(15, 'クウェラン闇弓術改式',                     '', true,  ''),
(16, 'ヴァルト式戦場剣殺法',                     '', true,  ''),
(17, 'ガオン無双獣投術',                         '', true,  ''),
(18, '聖戦士ローガン鉄壁の型',                   '', true,  ''),
(19, 'クーハイケン強竜乗法',                     '', true,  ''),
(20, 'キルガリー双刃戦武闘技',                   '', true,  ''),
(21, 'エステル式ポール舞踏術',                   '', true,  ''),
(22, '銛王ナイネルガの伝承',                     '', true,  ''),
(23, '死骸銃遊戯',                               '', true,  ''),
(24, '対奈落教会議・奈落反転神術',               '', false, ''),
(25, '『七色のマナ』式召異魔法術・魔使影光学理論', '', false, ''),
(26, 'アルショニ軽身跳闘法',                     '', false, ''),
(27, 'ノーザンファング鉱士削岩闘法',             '', true,  ''),
(28, 'キングスレイ式近接銃撃術',                 '', true,  ''),
(29, 'ネルネニアン騎獣調香術',                   '', true,  ''),
(30, 'オルフィード式蒸発妖精術',                 '', true,  ''),
(31, 'フィノア派森羅導術',                       '', true,  ''),
(32, 'ソムバートル制圧弓騎兵団',                 '', true,  ''),
(33, 'ハールーン魔精解放術式',                   '', false, ''),
(34, 'ウル・ディ・ガウル秘薬刀術',               '', true,  ''),
(35, 'アヴァルフ口伝・森択演奏術',               '', true,  ''),
(36, 'オークファルト念闘術',                     '', true,  ''),
(37, 'ガムベイ奈落技術討究派',                   '', false, ''),
(38, 'クルガタ歌葬術ファーラ派',                 'https://yutorize.work/ytsheet/sw2.5/?id=18RRPK', false, ''),
(39, 'クルガタ歌葬術バーク派',                   'https://yutorize.work/ytsheet/sw2.5/?id=FQgcum', false, ''),
(40, 'クルガタ歌葬術デボラ派',                   'https://yutorize.work/ytsheet/sw2.5/?id=qQvRky', true,  ''),
(41, '討滅武技ルインフォース',                   'https://yutorize.2-d.jp/ytsheet/sw2.5/?id=NUQrQP', true, ''),
(42, 'フォンディイ龍気誘術',                     'https://yutorize.2-d.jp/ytsheet/sw2.5/?id=1YtB0R', true, ''),
(43, 'ラティード応援舞術',                       'https://yutorize.2-d.jp/ytsheet/sw2.5/?id=YJrUYB', true, ''),
(44, 'アマミヤ流魔神討滅剣技',                   'https://yutorize.2-d.jp/ytsheet/sw2.5/?id=A8cXMu', true, ''),
(45, 'ハヤテ式二輪舞闘術',                       'https://yutorize.2-d.jp/ytsheet/sw2.5/?id=FzdDnj', true, ''),
(46, 'トゥール式双手武闘術グラド派',             'https://yutorize.2-d.jp/ytsheet/sw2.5/?id=7RqwkK', true, ''),
(47, 'リカント相伝憑依術式',                     'https://lite.evernote.com/note/c0260981-4000-20af-a788-0a1465c4d5ee', true, '');

-- --------------------------------------------------------
-- supplement_items (27 rows)
-- --------------------------------------------------------
INSERT INTO supplement_items (id, name, is_always, notes) VALUES
(1,  'エピックトレジャリー',         true,  ''),
(2,  'モンストラスロア',             true,  ''),
(3,  'メイガスアーツ',               true,  ''),
(4,  'バトルマスタリー',             true,  ''),
(5,  'アーケインレリック',           true,  ''),
(6,  'バルバロスレイジ',             true,  ''),
(7,  'バルバロスサーガ',             true,  ''),
(8,  'アビスブレイカー',             true,  ''),
(9,  'タイラントクリプト',           true,  ''),
(10, 'インフィニティコロッセオ',     true,  ''),
(11, 'キャラクタービルディングブック', true, ''),
(12, 'アウトロープロファイルブック', true,  ''),
(13, 'ラクシアライフ',               false, ''),
(14, 'グリフォンロード',             false, ''),
(15, '剣と荒野の放浪者',             false, ''),
(16, 'エンシェントブルー',           false, ''),
(17, '鉄道の都キングスフォール',     true,  ''),
(18, '星座の町サイレックオード',     true,  ''),
(19, '魔導の学府ユーシズ',           true,  ''),
(20, '盗掘の谷ソラーグ',             true,  ''),
(21, 'ブルライト博物誌',             true,  ''),
(22, 'ドーデン博物誌',               true,  ''),
(23, 'ウルシラ博物誌',               true,  ''),
(24, 'ヴァイスシティ-悪徳の贄-',     false, ''),
(25, 'デモンズライン-追憶の守人-',   false, ''),
(26, '泡沫世界モノクロマティカ',     false, ''),
(27, '泡沫世界龍骸剣刃譚',           true,  '');

-- --------------------------------------------------------
-- house_rule_items (56 rows)
--   ids 1-33: ハウスルール（is_prohibition=false）
--   ids 34-56: 旧 prohibition_items（012 で統合。is_prohibition=true、
--              rule_type は旧 id 23 の AI 使用禁止行のみ 'common'、他は 'item'）
--   sort_order は 012 のバックフィルと同じく id と同値
--   （並び順はグループ内で sort_order ASC NULLS LAST, id ASC）
-- --------------------------------------------------------
INSERT INTO house_rule_items (id, rule_type, supplement_id, about, description, is_prohibition, sort_order) VALUES
(1, 'common', NULL, '加工について', $desc$本キャンペーンでの武具の加工のやり方は
Discordの『RPサーバー』にある【加工・強化場】に宣言をする事で加工する事が出来ます。

【アビス強化について】
「アビス強化」開始のコメントに必要なものは
【「アビス強化」開始】「PC名」　武具【加工する武器防具】　アビス強化内容「」　となり、「アビス強化」終了時のコメントに必要なものは
【「アビス強化」終了】「PC名」　武具【加工する武器防具】　アビス強化内容「」　と　abt （アビスカース決定表Dicebot）
の二つとなります。
「アビス強化付け直し」開始のコメントに必要なものは
【「アビス強化付け直し」開始】「PC名」　武具【加工する武器防具】　アビス強化内容「」　となり、「アビス強化付け直し」終了時のコメントに必要なものは
【「アビス強化付け直し」終了】「PC名」　武具【加工する武器防具】　アビス強化内容「」　と　abt （アビスカース決定表Dicebot）
の二つとなります。
必要な時間は「現実時間1日」「ラクシア時間1日」となります。
【魔法の武器+1について】
「魔法の武器+1」加工開始のコメントに必要なものは
【「魔法の武器+1」加工開始】「PC名」　武具【加工する武器防具】　となり、「魔法の武器化+1」加工終了時のコメントに必要なものは
【「魔法の武器+1」加工終了】「PC名」　武具【加工する武器防具】
の二つとなります。
必要な時間は「現実時間5日」「ラクシア時間30日」となります。
【妖精の武器について】
「妖精の武器」加工開始のコメントに必要なものは
【「妖精の武器」加工開始】「PC名」　武具【加工する武器防具】　属性【】　となり、「妖精の武器」加工終了時のコメントに必要なものは
【「妖精の武器」加工終了】「PC名」　武具【加工する武器防具】　属性【】
の二つとなります。
必要な時間は「現実時間5日」「ラクシア時間30日」となります。$desc$, false, 1);

INSERT INTO house_rule_items (id, rule_type, supplement_id, about, description, is_prohibition, sort_order) VALUES
(2, 'common', NULL, 'アビスシャードの入手方法について', $desc$【アビスシャードの入手方法について】
　アビスシャードは名誉点で入手することもできます。
名誉点50点を消費することにより、アビスシャード1個が入手できるものとします。
アビスシャードを入手する為に使用した名誉点の最大値は、入手したアビスシャードを使用しても消滅しません。
※これは冒険者ランクがハイペリオンであっても消費しなければ入手できません。
※この方法で手に入れたアビスシャードは原則売却する事が出来ません。$desc$, false, 2);

INSERT INTO house_rule_items (id, rule_type, supplement_id, about, description, is_prohibition, sort_order) VALUES
(3, 'common', NULL, '一般技能について', $desc$通常の作成と同様に合計10レベルまで(コボルドは15レベルまで)獲得することができます。初期での獲得可能レベルは5までですが、奇数ｷｬｯﾌﾟが来るごとに一般技能のレベルどれか一つを上げることができます。新たに獲得することも可能で、次回レベルキャップ解放時まで保留にしておくこともできます(例えば「一般技能を1本に絞りたいので6キャップ解放まで一般技能を成長させない」こともできます)ただし、このレベルは自分のPCの最大レベル以下にならなくてはいけません。
例えば

バイ・トセーンシ(戦士2　学者1/ごろつき5　商人5)の場合
×バイ・トセーンシ(戦士3　学者2　斥候2/ごろつき6　商人5)
〇バイ・トセーンシ(戦士3　学者2/ごろつき5　商人5　案内人1)
〇バイ・トセーンシ(戦士6　学者2/ごろつき6　商人5　案内人1)

また、本CPではオリジナル一般技能を許可しています。オリジナルで獲得する場合、それがどんな技能なのかキャラシートに明記してください。
例えば

牧羊犬
牧童の騎獣版。牧場で放牧している家畜（主に羊）の群れの誘導や見張り、人間による盗難やオオカミなどの捕食動物から守るように訓練された作業獣。

のような感じです。簡単でいいので書いてくだされば幸いです。$desc$, false, 3);

INSERT INTO house_rule_items (id, rule_type, supplement_id, about, description, is_prohibition, sort_order) VALUES
(4, 'common', NULL, '性別について', $desc$『肉体性別に由来するもの』と定義します。
雌雄の差異がない種族については「性別に纏わる装備は装備できない」とします。
また、どうしても雌雄が食い違った装備を身につけたい場合、身に着けることは可能ですが、それら効果は発動しません。別途効果記入欄に「発動しない」旨の記載をお願いします。$desc$, false, 4);

INSERT INTO house_rule_items (id, rule_type, supplement_id, about, description, is_prohibition, sort_order) VALUES
(5, 'common', NULL, '日程管理について', $desc$現実時間での1日＝ラクシア時間の5日と考え、季節は四季ございます。また、劇中でのスタートは「4月1日」春からのスタートになります。
少々時空が歪みますが、ご了承ください。$desc$, false, 5);

INSERT INTO house_rule_items (id, rule_type, supplement_id, about, description, is_prohibition, sort_order) VALUES
(6, 'common', 1, 'トレジャードロップ表について', $desc$隻翼の大鷲亭(以下当OCP)では、エピックトレジャリー(以下ET)のp.59~掲載されているトレジャードロップ(以下TD)ルールを用いてエネミーを強化することもできます。
　強化に必要なPtや、内容はTD表に準拠し、表内に記載されているアイテムを獲得することができます。
　TD表を用いたドロップ品に関しては、以下の通りに処理をします。

①獲得されたアイテムはその売却額が依頼報酬額に上乗せして、アイテムを獲得しない
　　(例：TD表B>2,5>10点魔晶石(2000G/2)→依頼報酬額+1000G)


　②参加しているPL間で相談し、誰かがそのアイテムを、通常の半額で購入する
　　(売却額に等しい)


また、総報酬額がキャップによって指定された金額を上回った場合、その場のメンバーで、消耗品の補填に充てるなどして、帳尻を合わせていただけると幸いです。

※当OCPでは、総報酬額がキャップ規定を上回ることはございません。$desc$, false, 6);

INSERT INTO house_rule_items (id, rule_type, supplement_id, about, description, is_prohibition, sort_order) VALUES
(7, 'common', 8, '追加アビスカースについて', 'ダイスbotに入ってないため適応しません。', false, 7);

INSERT INTO house_rule_items (id, rule_type, supplement_id, about, description, is_prohibition, sort_order) VALUES
(8, 'common', 8, 'アビススキルについて', '採用しません。', false, 8);

INSERT INTO house_rule_items (id, rule_type, supplement_id, about, description, is_prohibition, sort_order) VALUES
(9, 'battleSkill', 12, '「シャドウステップ」の裁定について', 'シャドウステップの効果を、戦闘中1Rに1度しか適応できないに変更します', false, 9);

INSERT INTO house_rule_items (id, rule_type, supplement_id, about, description, is_prohibition, sort_order) VALUES
(10, 'item', 1, 'サングラスの処理について', $desc$・このアイテムを装着している間、アビスカース[まばゆい]のデメリットを無効にすることができます。
・「ラル＝ヴェイネ」「スマルティエ」のサングラスについて
通常通り機能しますが、以下の効果を追加いたします。
『このアイテムを装備している間、聞き込み判定に常に-2の修正が入ります。また、聞き込み判定に入る前に外す等の行動をする場合、隠蔽判定に成功する必要があります。達成値は卓ごとのGMの判断に任せます。』$desc$, false, 10);

INSERT INTO house_rule_items (id, rule_type, supplement_id, about, description, is_prohibition, sort_order) VALUES
(11, 'item', 1, '多機能○○ベルト等の装飾品を増やすアイテムについて', '「装飾品」を追加で装備可能とする能力は、装飾品として装備することができる「冒険者アイテム」も、その追加した装備枠に装備できるものとします。', false, 11);

INSERT INTO house_rule_items (id, rule_type, supplement_id, about, description, is_prohibition, sort_order) VALUES
(12, 'item', 4, 'ミハウ式流円闘技流派武器〈ウォースペード〉について', $desc$以下のように裁定します
アックスB &スタッフB→スタッフB、金額3500G+20名誉点、斬撃武器$desc$, false, 12);

INSERT INTO house_rule_items (id, rule_type, supplement_id, about, description, is_prohibition, sort_order) VALUES
(13, 'item', 4, 'ノーザンファング鉱士削岩闘法流派武器〈ノーザンファングマトック〉について', $desc$以下のように裁定を修正します
ウォーハンマーB&スタッフB→スタッフA$desc$, false, 13);

INSERT INTO house_rule_items (id, rule_type, supplement_id, about, description, is_prohibition, sort_order) VALUES
(14, 'item', 10, 'トワイライトブランド', '購入段階でダメージボーナスを得る種族を決定してください。一度決定したダメージボーナスを得る種族は変更できません。', false, 14);

INSERT INTO house_rule_items (id, rule_type, supplement_id, about, description, is_prohibition, sort_order) VALUES
(15, 'item', 10, 'レイジングレイヴ', '【ダークハンター】技能での使用を不可とします。', false, 15);

INSERT INTO house_rule_items (id, rule_type, supplement_id, about, description, is_prohibition, sort_order) VALUES
(16, 'item', 10, 'コンバットスタッフ', '必筋　8→18', false, 16);

INSERT INTO house_rule_items (id, rule_type, supplement_id, about, description, is_prohibition, sort_order) VALUES
(17, 'item', 21, '【死骸銃遊戯】の《即応弾》の処理について', 'この弾で発生するダメージは「K10+魔力」の物理ダメージとして処理します', false, 17);

INSERT INTO house_rule_items (id, rule_type, supplement_id, about, description, is_prohibition, sort_order) VALUES
(18, 'item', 21, '【死骸銃遊戯】の流派武器の処理について', $desc$以下のように裁定します
必筋+3　流派秘伝以外使用時命中-1$desc$, false, 18);

INSERT INTO house_rule_items (id, rule_type, supplement_id, about, description, is_prohibition, sort_order) VALUES
(19, 'race', 6, 'シザースコーピオンについて', 'レベル6：「装飾品：腰」の装飾品を1つまで「装飾可能部位：その他」に装備可能とします。(ただし、装飾可能アイテムは複数装備してもよい)', false, 19);

INSERT INTO house_rule_items (id, rule_type, supplement_id, about, description, is_prohibition, sort_order) VALUES
(20, 'race', 6, 'アルボルについて', '種族特徴<炎の盾>は選択できません。', false, 20);

INSERT INTO house_rule_items (id, rule_type, supplement_id, about, description, is_prohibition, sort_order) VALUES
(21, 'race', 27, 'ミアキスについて', $desc$当該サプリ(p40)の化け猫、及び2.0サプリ「イグニスブレイズ(p14)」のミアキスを使用できます。
生まれ表については龍骸剣刃譚記載の生まれ表は不可。IBの占い師生まれは技体心の値はそのままに戦舞士に置き換えます。
生まれ表https://lite.evernote.com/note/c4c7a0f2-aed8-4b0a-391d-4e2c3611c78b$desc$, false, 21);

INSERT INTO house_rule_items (id, rule_type, supplement_id, about, description, is_prohibition, sort_order) VALUES
(22, 'skill', 3, '陣率について', '「対象：軍師自身」の効果を軍師のもつすべての部位に適応可能とします。ただし、「1度だけ」等の制約のある陣率は、「部位全体で1度のみ」適応可能とします。', false, 22);

INSERT INTO house_rule_items (id, rule_type, supplement_id, about, description, is_prohibition, sort_order) VALUES
(23, 'skill', 6, 'フィジカルマスターについて', $desc$その他部位の判定について
その他部位の命中及び回避は基本「フィジカルマスター+器用/敏捷」で判定します。

魔装の効果で他の技能で判定を行える場合はそちらを使用することもできます。
生命及び精神抵抗はPCの生命・精神抵抗力を使用して判定します。
複数の部位(コア部位含む)が抵抗力判定の対象になった場合、抵抗力判定を1回行い、その結果を全ての部位に適用します。
その他部位のステータスは『BR』p58(HP、MP、防護点)p59(生来武器のステータス)を参照してください。

戦闘特技について
原則として、以下の常時特技を除いて「その他部位」は常時特技の効果を得られず、宣言特技を使用することができません。
《足さばき》《縮地》《影走り》《ランアンドガン》《ターゲッティング》《鷹の目》《抵抗強化Ⅰ.Ⅱ》《武器習熟A.S/格闘》《武器の達人》
ただし、ディアボロの魔装『胴体効果継続』を獲得している場合、その他部位に上記以外の常時特技を使用することができます。
その他部位に常時特技を引き継いだ場合、コア部位に引き継がせた常時特技を適用させることはできません。
また、複数の宣言特技を使用することができる常時特技は引き継がせることはできません。

【幻獣種のフィジカルマスターについて】
特例として、幻獣種も一部魔装を使用できるものとします。
その際、専用魔装は以下の種族を参照します。
・ムシュフシュ→シザースコーピオン（【交差攻撃】禁止）
・ギーブル→ドレイク（ブレスのみ）
・ブロタール→共通のみ　ただし【部位即応＆強化】を取得可能
※全ての幻獣は【部位属性付与】および【コア耐久超増強】は取得できず、【部位耐久増強】は意味がありません。また、ムシュフシュとギーブルは【部位即応＆強化】を取得できません。$desc$, false, 23);

INSERT INTO house_rule_items (id, rule_type, supplement_id, about, description, is_prohibition, sort_order) VALUES
(24, 'skill', 8, 'アビスゲイザーについて', 'ノーザンファング鉱士削岩闘法流派武器〈ノーザンファングマトック〉について', false, 24);

INSERT INTO house_rule_items (id, rule_type, supplement_id, about, description, is_prohibition, sort_order) VALUES
(25, 'skill', 8, 'ダークハンターについて', $desc$一部に記載されている2d（）の（）を廃止します。【＞気操法】のコストで[6,6]が出た場合、12点支払わなければいけません。
【○大乱獲】【○魔生法】が取得できません。
【属性付・○】についてはHPと同時にMPも消費します。
コストを払ってHPが「0」以下になる場合、その操気は使用できません。ただし、「不屈」を持っている場合は使用可能ですが、生死判定に失敗した場合、操気は失敗になります。
【>>△操浮術】を「対象：自身X」に変更します
すべての操気の「『魔神・アンデッド』には～」の項目を削除します。【>>△気防陣】の場合、魔神、アンデッド相手であっても受けるダメージが「－2」点になります。
【破邪光弾】の威力は40、【破邪光槍】は威力60で統一します

使用不可種族は以下の通りです。
グラスランナー
メリア
リルドラケン
アルボル
ディアボロ
※「アビスゲイザー」「ダークハンター」の条件はPCにかかる条件のため、NPCおよびエネミーには適用されません。つまり、NPCがアビスゲイザーを使用することも、リルドラケンのNPCがダークハンターを使用することができます。$desc$, false, 25);

INSERT INTO house_rule_items (id, rule_type, supplement_id, about, description, is_prohibition, sort_order) VALUES
(26, 'school', NULL, 'ダイケホーン双霊氷術及びオルフィード式蒸発妖精術について', $desc$どちらか片方のみしか取得できませんのでご注意ください 。
$desc$, false, 26);

INSERT INTO house_rule_items (id, rule_type, supplement_id, about, description, is_prohibition, sort_order) VALUES
(27, 'item', NULL, 'マナチャージクリスタルについて', '点数に関わらず、1PCの所持できる数は1個までです。', false, 27);

INSERT INTO house_rule_items (id, rule_type, supplement_id, about, description, is_prohibition, sort_order) VALUES
(28, 'item', 5, '起動外骨格について', $desc$この騎獣は購入のみで入手できます。
購入時に「土」「水・氷」「炎」「風」「雷」のいずれかを選択します。
「種族：スプリガン」のPCが購入する際は「起動外骨格(巨人用)」か「起動外骨格(小人形態用)」のいずれかを選択します。小人形態時に「起動外骨格(巨人用)」を、巨人形態時に「起動外骨格(小人形態用)」を使用する事はできません。購入金額は変わりません。
〇ガン　を使用できません。
以下の能力を得ます。

〇魔力放電【〇〇】
　「部位：魔動砲」での近接攻撃を、行います。この時発生するダメージは【〇〇】属性魔法ダメージとなります。 【〇〇】には購入時に選択した属性の名称が入ります。 また、「部位：魔動砲」で攻撃する際は騎手の主動作を消費します。$desc$, false, 28);

INSERT INTO house_rule_items (id, rule_type, supplement_id, about, description, is_prohibition, sort_order) VALUES
(29, 'battleSkill', NULL, '〈茨のローブ〉装備状態での〈かばう〉の挙動', $desc$1.荊のローブの装備者が《かばう》により他キャラクターへの近接攻撃を引き受けた場合、攻撃者に荊によるダメージは発生します。<茨のローブ>の装備者が「攻撃された」事実に重点を置き、特例として茨のローブによるダメージは発生するものとします。
2.荊のローブの装備者への近接攻撃を《かばう》により他キャラクターが引き受けた場合、攻撃者に荊によるダメージは発生しません。これは①の特殊裁定によるものです。
3.荊のローブの装備者への近接攻撃を《かばう》により他キャラクターが引き受けた場合、かばったキャラクターに荊によるダメージは発生しません。<かばう>を行ったキャラクターが、射程：接触で行動していると明記されていないため、<かばう>使用者へ<茨のローブ>によるダメージは発生しないものとします。$desc$, false, 29);

INSERT INTO house_rule_items (id, rule_type, supplement_id, about, description, is_prohibition, sort_order) VALUES
(30, 'item', NULL, 'バヨネットについて', 'このアイテムは、武器としての加工を不可とします。', false, 30);

INSERT INTO house_rule_items (id, rule_type, supplement_id, about, description, is_prohibition, sort_order) VALUES
(31, 'skill', 9, 'ビブリオマンサーについて', $desc$以下のルールを追加します。
・魔法を購入/会得する場合は、指定されたガメルを消費してください。
・魔法を購入/会得するのはセッションの開始前までにお願いします。
・応急行使枠の魔法の特殊失敗値はその魔法毎に、ランダム2つの出目を設定してください。
・セッション中、特殊失敗値は、すべての応急行使枠の魔法で同じ値を設定することができません。
・準備行使枠の魔法は、各セッション開始時にそのレベル帯で決められた個数の魔法を事前準備のタブで宣言してください。
・補助動作で使用可能な秘奥魔法の禁止
・「△【コングラーレ=ラピダス】-先手凍結-」はセッション中1度のみ使用可能とします。$desc$, false, 31);

INSERT INTO house_rule_items (id, rule_type, supplement_id, about, description, is_prohibition, sort_order) VALUES
(32, 'item', 9, 'スクリーンエプロン', $desc$購入金額を以下の通り修正します。購入金額を以下の通り修正します。
3,000G→9,600G$desc$, false, 32);

INSERT INTO house_rule_items (id, rule_type, supplement_id, about, description, is_prohibition, sort_order) VALUES
(33, 'item', 10, 'インフィニットコロッセオ記載のアイテムの購入について', $desc$サプリメントに記載の購入可能なアイテムすべては、闘技場Pの1/4Gの価格で購入可能です。
しかし闘技場内での使用ではないため、闘技場外で使用する際の効果しか発揮されません。
その他取引不可、非売品のアイテム・装備品は変わらず購入不可とします。
もちろんサプリメントのデータを使用する場合は、対象サプリメントの購入が必要です。$desc$, false, 33);

INSERT INTO house_rule_items (id, rule_type, supplement_id, about, description, is_prohibition, sort_order) VALUES
(34, 'item', NULL, '全般', '・非売品・取引不可', true, 34);

INSERT INTO house_rule_items (id, rule_type, supplement_id, about, description, is_prohibition, sort_order) VALUES
(35, 'item', NULL, '特殊', '・ボトルドール', true, 35);

INSERT INTO house_rule_items (id, rule_type, supplement_id, about, description, is_prohibition, sort_order) VALUES
(36, 'item', NULL, '装飾品', $desc$・ラル＝ヴェイネの羽冠
・レッサー･アームスフィアⅠ/Ⅱ
・影の深靴$desc$, true, 36);

INSERT INTO house_rule_items (id, rule_type, supplement_id, about, description, is_prohibition, sort_order) VALUES
(37, 'item', NULL, '冒険道具類', $desc$・地熱の軍配
・陽熱の軍配
・グラマーポール
・引き戻しの綱
・氷結界の鞭
・氷結界の鎖
・穢れの角Ⅰ/Ⅱ/Ⅲ
・レッサードラゴンの竜珠
・太陽の石
・ミスティカル・リーフ
・呪い抑えの札Ⅰ/Ⅱ
・一時覚醒の竜鱗
・インタラプトパリィ
・身代わりの泥人形
・身代わり土偶
・夢幻充填の魔晶石
・偉大なる魔法所の紙片
・ディナースイーパー
・マジカルキャプチャーハンド$desc$, true, 37);

INSERT INTO house_rule_items (id, rule_type, supplement_id, about, description, is_prohibition, sort_order) VALUES
(38, 'item', NULL, 'ポーション', $desc$・生命の黄金果
・黄金蜜の雫$desc$, true, 38);

INSERT INTO house_rule_items (id, rule_type, supplement_id, about, description, is_prohibition, sort_order) VALUES
(39, 'item', NULL, '<盾B>', '・タラスクシールド', true, 39);

INSERT INTO house_rule_items (id, rule_type, supplement_id, about, description, is_prohibition, sort_order) VALUES
(40, 'item', NULL, '<ソードB>', $desc$・バリアブルソード
・強者の剣$desc$, true, 40);

INSERT INTO house_rule_items (id, rule_type, supplement_id, about, description, is_prohibition, sort_order) VALUES
(41, 'item', NULL, '<ソードA>', $desc$・バリアブルブレード
・斬魔の剣
・ヴレフランベルジュ$desc$, true, 41);

INSERT INTO house_rule_items (id, rule_type, supplement_id, about, description, is_prohibition, sort_order) VALUES
(42, 'item', NULL, '<ソードS>', $desc$・バリアブルブランド
・トレフランベルジュ$desc$, true, 42);

INSERT INTO house_rule_items (id, rule_type, supplement_id, about, description, is_prohibition, sort_order) VALUES
(43, 'item', NULL, '<アックスA>', '・紅炎のハルバード', true, 43);

INSERT INTO house_rule_items (id, rule_type, supplement_id, about, description, is_prohibition, sort_order) VALUES
(44, 'item', NULL, '<アックスS>', '・紅炎のクーゼ', true, 44);

INSERT INTO house_rule_items (id, rule_type, supplement_id, about, description, is_prohibition, sort_order) VALUES
(45, 'item', NULL, '<スピアA>', '・セレスティアルランス ・アイス', true, 45);

INSERT INTO house_rule_items (id, rule_type, supplement_id, about, description, is_prohibition, sort_order) VALUES
(46, 'item', NULL, '<スピアS>', $desc$・アストラルランス
・グレイシャルスピア$desc$, true, 46);

INSERT INTO house_rule_items (id, rule_type, supplement_id, about, description, is_prohibition, sort_order) VALUES
(47, 'item', NULL, '<スタッフB>', $desc$・フレグランススタッフ
・ヘビーフレグランススタッフ$desc$, true, 47);

INSERT INTO house_rule_items (id, rule_type, supplement_id, about, description, is_prohibition, sort_order) VALUES
(48, 'item', NULL, '<スタッフA>', $desc$・愛憎のスタッフ
・フレグランスケイン
・ヘビーフレグランスケイン$desc$, true, 48);

INSERT INTO house_rule_items (id, rule_type, supplement_id, about, description, is_prohibition, sort_order) VALUES
(49, 'item', NULL, '<フレイルA>', '・バッドツインズ', true, 49);

INSERT INTO house_rule_items (id, rule_type, supplement_id, about, description, is_prohibition, sort_order) VALUES
(50, 'item', NULL, '<ウォーハンマーA>', '・サンダーバッシュ', true, 50);

INSERT INTO house_rule_items (id, rule_type, supplement_id, about, description, is_prohibition, sort_order) VALUES
(51, 'item', NULL, '<ウォーハンマーS>', '・サンダースマッシュ', true, 51);

INSERT INTO house_rule_items (id, rule_type, supplement_id, about, description, is_prohibition, sort_order) VALUES
(52, 'item', NULL, '<ボウA>', '・スイフトウィンド', true, 52);

INSERT INTO house_rule_items (id, rule_type, supplement_id, about, description, is_prohibition, sort_order) VALUES
(53, 'item', NULL, '騎獣・追加部位', $desc$・可変起動外骨格
・信頼の側車$desc$, true, 53);

INSERT INTO house_rule_items (id, rule_type, supplement_id, about, description, is_prohibition, sort_order) VALUES
(54, 'item', NULL, 'アイテム', $desc$以下の制作者が作成したアイテムの使用を禁止します。
・"万緑"のハヤマ
・"終橙"のハヤミ
・"殺竜鬼"ヴァンダル
・"万眼卿"カルセイ・ライトファーグ$desc$, true, 54);

INSERT INTO house_rule_items (id, rule_type, supplement_id, about, description, is_prohibition, sort_order) VALUES
(55, 'item', NULL, '装備', $desc$以下の制作者が作成した装備品の使用を禁止します。
・"栄冠与えし者"チャルグ
・"万緑"のハヤマ
・"終橙"のハヤミ
・"殺竜鬼"ヴァンダル
・"妖精のあやし手"デナ・ヴィドー$desc$, true, 55);

INSERT INTO house_rule_items (id, rule_type, supplement_id, about, description, is_prohibition, sort_order) VALUES
(56, 'common', NULL, '全般', '立ち絵や背景利用においてAIの使用を全面的に禁止します。', true, 56);

-- --------------------------------------------------------
-- original_items (4 rows)
-- --------------------------------------------------------
INSERT INTO original_items (id, type, name, url) VALUES
(1, '騎獣',        'エルトリアス・エクスパンド',  'https://lite.evernote.com/note/95851189-e26d-fc06-61e8-0e8674ec9ad6'),
(2, 'アイテム・加工', 'マイク・マイク加工',        'https://yutorize.2-d.jp/ytsheet/sw2.5/?id=KJHhcr'),
(3, '装飾品',      'ボーンテイルベルト',           'https://yutorize.2-d.jp/ytsheet/sw2.5/?id=UvMTBe'),
(4, '冒険道具類',  'スラッシュテイル',             'https://yutorize.2-d.jp/ytsheet/sw2.5/?id=z4uOSP');

-- --------------------------------------------------------
-- regulation_items (8 rows)
-- --------------------------------------------------------
INSERT INTO regulation_items (id, name, description, recruitment, stage, race, supplement, notes, level_cap_belt) VALUES
(1, '学び舎と不思議な魔導雑貨店', '', '', '舞台はブルライト地方がユーシズ、魔法学園『七色のマナ』。', 'TEST', 'TEST', 'TEST', 'B');

INSERT INTO regulation_items (id, name, description, recruitment, stage, race, supplement, notes, level_cap_belt) VALUES
(2, '信仰と歌の国クルガタ', '', '', $stage$祈りに歌を　地底に光を　求めるものには救済を
舞台はケルディオン大陸が信仰の国クルガタ、あらゆる信仰が集まった首都リットバール。
信仰毎に区画分けされた土地が立ち並ぶ中、信仰に関わらず人気の酒場がある。
「奇跡の箱庭亭」。それはフォルトゥナ信仰の団体が経営する依頼斡旋ギルド。
PCはそれぞれの教会に所属する聖歌隊の見習い兵(冒険者)、或いはギルド所属の暗部(放浪者)。
あなた達は奇跡の箱庭亭を通しその名を上げ、リットバール、ひいてはクルガタに己が信じる神の名を轟かせる為、依頼を受けていく事になる。$stage$, 'TEST', 'TEST', 'TEST', 'B');

INSERT INTO regulation_items (id, name, description, recruitment, stage, race, supplement, notes, level_cap_belt) VALUES
(3, '開拓の地アンキル', '', '', $stage$拓けや進めや轍の道！目指すはベイセ！希望の星となる為に！
アルフレイム大陸ウルシラ地方、エユトルゴ騎兵国より西に続く線路の終着点アンキル。スフバールへ続く駅を任されたのは、エユトルゴ冒険者ギルドの『鉄の轍亭』アンキル支部はそこにある。
PCは、ベイセへの輸送ルート開拓や、開拓した輸送ルートの安定化を目的にエユトルゴの冒険者ギルドより派遣された冒険者たち。
『タダで旅ができるから』
『見聞を広めるために』
『どこか遠くに行きたかったから』
訪れる理由は様々。原生生物や現地の人々と協力して、開拓の日々を始めよう！$stage$, 'TEST', 'TEST', 'TEST', 'B');

INSERT INTO regulation_items (id, name, description, recruitment, stage, race, supplement, notes, level_cap_belt) VALUES
(4, '海渡る戦列の楼閣アルショニアン・ガレオン', '', '', $stage$遠く揺蕩う船が見えたら　それはカササギの来訪かもしれない
「名無しの宝は俺たちのモンさ」
それは我らが船長の口癖だ。
ドーデン地方よりブルライト地方にかけて、お宝の噂ある所に現れる船ーーアルショニアン・ガレオン号。
財宝求めて旅する彼らの、後には何も残さない。そんな姿から、彼らは「カササギ」「渡り鳥」とも呼ばれた。
今日も船長、アルバ・D・アイランテスの笑い声が大海原に響き渡る。
あなた達はカササギーー『アルショニアン・ガレオン号』の一員です。
船長アルバの号令の下、まだ見ぬ場所へと飛び出そう！$stage$, 'TEST', 'TEST', 'TEST', 'B');

INSERT INTO regulation_items (id, name, description, recruitment, stage, race, supplement, notes, level_cap_belt) VALUES
(5, '学術都市ラクリマ', '', '', $stage$ケルディオン大陸のとある地域。異常気象続くこの土地に、君たちは集った。
多くの識者が研究のため集うこの地で、研修生(セイト)として招致された君たちは、憧れる教授(センセイ)たちと共に自体収束に勤しんでいく。
荒れ狂うテンキをその眼で捉え、世界の真実に近づこう。$stage$, 'TEST', 'TEST', 'TEST', 'B');

INSERT INTO regulation_items (id, name, description, recruitment, stage, race, supplement, notes, level_cap_belt) VALUES
(6, '聖なる唱の舞台袖', '', '', $stage$ケルディオン大陸のとある地域。
『信仰と歌の国クルガタ』で伴楽団(ブレーメン)として活躍する君たちは今日も大忙し。
迷子のお守りから、果ては魔域の踏破まで。君たちの仕事は多岐にわたる。
そんな君たちに、奇妙な依頼が舞い込んで・・・・？$stage$, 'TEST', 'TEST', 'TEST', 'B');

INSERT INTO regulation_items (id, name, description, recruitment, stage, race, supplement, notes, level_cap_belt) VALUES
(7, '第七期 治癒の秘湯マリスク',
$desc$ザムサスカとウルシラの間に位置するこの地では、魔域を有効活用できないかと日夜様々な研究が行われています。
この湯治施設もその一つ。
PCたちはそこの研究員や、彼らを護衛する冒険者として日夜調査に明け暮れています。$desc$,
$recruit$ソード・ワールド2.5コミュニティ『隻翼の大鷲亭』7期の募集になります。

募集種別はGM・PL不問。両方で遊ぶ事も可能です。

形式はレベルキャップシステムを採用したオープンワールドキャンペーン(初期作成～LV12)です。

期間
10/16～：キャラ作成開始
11/6～：キャンペーンスタート(約半年)
必須
基本ルールブックⅠ～Ⅲ
オンラインセッションを行える環境(PC推奨)
Discordアカウント
余裕を持って卓に参加できる時間
楽しむ心
コアタイム
21:30～26:30$recruit$,
$stage$アンキルより北西に存在するダール要塞。そのダール要塞近郊に、この湯治場は存在します。
アンキルとの輸送路が配備され、要塞建築の進捗には目を見張るものがあります。
しかしながら、ゼガンの軍勢による攻撃、妨害によって、傷つく兵士も後を絶ちません。
そんなアビスの浸食を強く受けた兵士たちが、傷を癒す湯治場がここマリスクなのです。
マリスクでは、ダール要塞に備わっていた一部の大型魔動機を利用して、奈落鑑定士による魔域の探知及び、
奈落の呪いに対抗できる薬湯の調査、異界でとれる植物の研究などが盛んにおこなわれてきました。
といっても危険な魔域も多く存在していますので、そういった危険な魔域による浸食を抑えるべく、
古くよりこの地には冒険者ギルド(当時は、防人の詰所)が敷設され、これの対処にあたってきました。
ザムサスカ地方は旧ルセア王国王都を目指す冒険者も少なくなく、この湯治場のやっかいになる者も。
また、そんな彼らの口伝を聞いてか、奈落の呪いを癒すべく、例え遠方であったとしても、この地を訪ねる者もいるとか、いないとか。$stage$,
'TEST', 'TEST', 'TEST', 'B');

INSERT INTO regulation_items (id, name, description, recruitment, stage, race, supplement, notes, level_cap_belt) VALUES
(8, '第八期 天空の迷宮鉱山ヒスダリア',
$desc$ドーデン地方のキングスレイ共和国の北方に位置する鉱山擁する巨大都市ヒスダリア。その上空に浮かぶヒスドゥール浮遊連峰に、ある日突然巨大な塔の迷宮が現れました。
迷宮があれば人が集まる。迷宮を踏破する為集められた冒険者たるあなた達は、今日も迷宮に潜り踏破の栄光を追いかけます。$desc$,
$recruit$ソード・ワールド2.5コミュニティ『隻翼の大鷲亭』8期の募集になります。

募集種別はGM・PL不問。両方で遊ぶ事も可能です。

形式はレベルキャップシステムを採用したオープンワールドキャンペーン(Lv5～Lv13)です。

期間
8月上旬：キャラ作成開始
8月上旬～：キャンペーンスタート(約半年)
必須
基本ルールブックⅠ～Ⅲ
オンラインセッションを行える環境(PC推奨)
Discordアカウント
余裕を持って卓に参加できる時間
楽しむ心
コアタイム
21:30～26:30$recruit$,
$stage$キングスレイ鉄鋼共和国、その巨大都市ヒスダリアへ影を落とすヒスドゥール浮遊連峰に、5年前突如として塔の迷宮が出現しました。
時折迷宮から溢れてくる魔物に脅威を覚えたヒスダリアでは、魔物の討伐や迷宮の踏破を掲げて冒険者達を集めています。
その中には元々ヒスドゥールに棲んでいたカレイドや、隣国ザッハークより迷宮に興味を持ったシザースコーピオンや幻獣達も混ざっているようです。
迷宮が出現したことで、ヒスドゥールへの連絡船を持つヒスダリアでは多くの人が集まるようになりました。冒険者ギルド『一角獣の蹄亭』に所属するあなた達はそんな人達の困りごとを解決したり、迷宮の秘密を求め塔を登ったりする日々を送っています。$stage$,
'', '', '', 'C');

-- --------------------------------------------------------
-- item_regulations (7 rows)
-- --------------------------------------------------------
INSERT INTO item_regulations (item_type, item_id, regulation_id) VALUES
-- regulation 8 (ヒスダリア)
('race', 59, 8),        -- シザースコーピオン
-- regulation 7 (マリスク)
('race', 59, 7),        -- シザースコーピオン
('god', 9, 7),          -- ダリオン (is_always=false)
('school', 24, 7),      -- 対奈落教会議・奈落反転神術 (is_always=false)
('supplement', 13, 7),  -- ラクシアライフ (is_always=false)
-- regulation 1 (学び舎)
('school', 25, 1),      -- 七色のマナ式召異魔法術・魔使影光学理論 (is_always=false)
-- regulation 4 (ガレオン)
('school', 26, 4);      -- アルショニ軽身跳闘法 (is_always=false)

-- --------------------------------------------------------
-- Set existing regulation_items to published
-- --------------------------------------------------------
UPDATE regulation_items SET publish_type = 'public';

-- --------------------------------------------------------
-- Reset sequences to MAX(id) after seed inserts
-- --------------------------------------------------------
SELECT setval('race_items_id_seq',       (SELECT MAX(id) FROM race_items));
SELECT setval('god_items_id_seq',        (SELECT MAX(id) FROM god_items));
SELECT setval('school_items_id_seq',     (SELECT MAX(id) FROM school_items));
SELECT setval('supplement_items_id_seq', (SELECT MAX(id) FROM supplement_items));
SELECT setval('house_rule_items_id_seq', (SELECT MAX(id) FROM house_rule_items));
SELECT setval('original_items_id_seq',   (SELECT MAX(id) FROM original_items));
SELECT setval('regulation_items_id_seq', (SELECT MAX(id) FROM regulation_items));
