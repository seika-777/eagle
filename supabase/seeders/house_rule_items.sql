-- ============================================================
-- seeders/house_rule_items.sql
-- house_rule_items テーブルを最新データ 56 行で再構築する単体 seeder。
--   - 実行前提: migration 012（prohibition_items 統合・is_prohibition /
--     sort_order カラム追加）が適用済みであること。
--   - ids 1-33: ハウスルール（is_prohibition=false）
--   - ids 34-56: 旧 prohibition_items（is_prohibition=true、rule_type は
--     旧 id 23 の AI 使用禁止行のみ 'common'、他は 'item'）
--   - sort_order は id と同値
--     （並び順はグループ内で sort_order ASC NULLS LAST, id ASC）
--   - seed.sql と同じく updated_by / updated_at は含めない。
-- ============================================================

BEGIN;

-- --------------------------------------------------------
-- 既存データ削除
-- --------------------------------------------------------
DELETE FROM house_rule_items;

-- --------------------------------------------------------
-- house_rule_items (56 rows)
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
-- シーケンス調整
-- --------------------------------------------------------
SELECT setval('house_rule_items_id_seq', (SELECT MAX(id) FROM house_rule_items));

COMMIT;
