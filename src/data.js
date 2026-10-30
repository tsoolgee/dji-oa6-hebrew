// עץ התפריטים של DJI Osmo Action 6 (קושחה 01.05.08.03, יולי 2026)
// conf: h = מאומת ממקור רשמי של DJI, m = ממדריכים/ביקורות, l = לפי דגמים קודמים (אקשן 4 / 5 פרו), לא אומת לאקשן 6
// o = אפשרויות: [אנגלית, עברית]
const O = (...a) => a.map(x => Array.isArray(x) ? x : [x, x]);
const FPS_STD = ['24', '25', '30', '48', '50', '60'];

const N = {};
function node(id, p) { N[id] = Object.assign({ id, kids: [], conf: 'h' }, p); return N[id]; }

/* ---------- כפתורים פיזיים ---------- */
node('btn_shutter', { en: 'Shutter/Record Button', he: 'לחצן צילום/הקלטה', icon: 'rec', type: 'info',
  d: 'לחיצה אחת: צילום תמונה או התחלה/עצירה של הקלטה. כשהמצלמה כבויה, לחיצה אחת מדליקה אותה ומתחילה להקליט מיד (SnapShot), ולחיצה נוספת עוצרת. אחרי 3 שניות בלי פעולה המצלמה נכבית לבד. בעומק של כ-14 מ\' ויותר הלחצן ננעל אוטומטית (הגנה מפני לחץ מים) ואז לחיצה על QS מצלמת או מקליטה, ולחיצה כפולה פותחת את ההחלפה המהירה. לחיצה ארוכה של 5 שניות מכניסה ידנית למצב צלילה.' });
node('btn_qs', { en: 'Power/Quick Switch Button', he: 'לחצן הפעלה / החלפה מהירה (QS)', icon: 'power', type: 'info',
  d: 'לחיצה ארוכה: הדלקה/כיבוי. במסך הצילום: לחיצה פותחת את דף ההחלפה המהירה, ולחיצות נוספות עוברות בין המצבים השמורים. בזמן הקלטת וידאו או הילוך איטי: לחיצה מסמנת "רגע שיא" (Highlight). בכל מסך אחר: לחיצה חוזרת למסך הצילום.' });

node('rear_screen', { en: 'Rear Touchscreen', he: 'מסך מגע אחורי', icon: 'screen', type: 'info', d: 'המסך הראשי: 2.5 אינץ׳, ‏400×712, בהירות 800 ניט (1000 בשיא). גם המסך הקדמי מציג את אותם תפריטים. החלקה למעלה מתחתית המסך מעירה אותו ומעבירה אליו.' });
node('front_screen', { en: 'Front Touchscreen', he: 'מסך מגע קדמי', icon: 'front', type: 'info', d: 'מסך ריבועי 1.46 אינץ׳ (342×342) ליד העדשה, לסלפי ולוולוגים, בהירות 800 ניט. גם הוא מסך מגע עם אותם תפריטים. "תצוגה מלאה במסך הקדמי" קובעת אם התמונה ממלאת את הריבוע או מוצגת במלואה עם פסים שחורים.' });
node('lens', { en: 'Lens / Glass Lens Cover', he: 'עדשה ומכסה זכוכית', icon: 'aperture', type: 'info', d: 'עדשה 155° עם צמצם משתנה f/2.0–f/4.0 וחיישן 1/1.1 אינץ׳ ריבועי. מכסה הזכוכית מוברג; לא להסיר אותו לעיתים קרובות (נכנס אבק). במקומו אפשר להבריג עדשת מאקרו (מיקוד 11–75 ס"מ, עמידה רק להתזות) או עדשת FOV Boost ‏(182°, בלי הילוך איטי).' });
node('ct_sensor', { en: 'Color Temperature Sensor', he: 'חיישן טמפרטורת צבע', icon: 'sun', type: 'info', d: 'ליד הלוגו בחזית. עוזר לאיזון הלבן, גם מתחת למים. לא לכסות באצבע או באביזר.' });

/* ---------- תנועות במסך ---------- */
node('g_down', { en: 'Swipe down', he: 'החלקה למטה', icon: 'arrowDown', type: 'info', d: 'מהחלק העליון של המסך: פותחת את מרכז הבקרה. החלקה נוספת שמאלה בתוכו מציגה את מידע האחסון.' });
node('g_up', { en: 'Swipe up', he: 'החלקה למעלה', icon: 'arrowUp', type: 'info', d: 'מהחלק התחתון של המסך: פותחת את פרמטרי ההקלטה של המצב הנוכחי (רזולוציה, קצב פריימים, ייצוב, שדה ראייה). החלקה למטה חוזרת.' });
node('g_side', { en: 'Swipe left / right', he: 'החלקה ימינה / שמאלה', icon: 'arrowsH', type: 'info', d: 'במסך הצילום: פותחת את בורר מצבי הצילום. מחליקים לבחירת מצב ומקישים עליו.' });
node('g_long', { en: 'Long press (playback)', he: 'לחיצה ארוכה בזמן צפייה', icon: 'play', type: 'info', d: 'בזמן צפייה בסרטון: לחיצה ארוכה על אזור ריק מנגנת במהירות כפולה.' });

/* ---------- מסך הצילום ---------- */
node('lv_storage', { en: 'Storage Capacity/Remaining Recording Time', he: 'אחסון / זמן הקלטה שנותר', icon: 'store', type: 'info', d: 'פינה שמאלית עליונה (מספר 1 באיור): כמה זמן הקלטה נשאר, למשל 1h53m. האייקון מראה אם שומרים לזיכרון הפנימי או לכרטיס.' });
node('lv_battery', { en: 'Battery Level', he: 'רמת סוללה', icon: 'battery', type: 'info', d: 'פינה ימנית עליונה (מספר 4): אחוז הסוללה, כתוב בתוך סמל הסוללה.' });
node('lv_playback', { en: 'Playback', he: 'גלריה', icon: 'play', type: 'page', d: 'שמאל, באמצע (מספר 2): ריבוע עם משולש. הקשה מציגה את התמונה או הסרטון האחרונים.' });
node('lv_mode', { en: 'Shooting Mode', he: 'מצב צילום', icon: 'video', type: 'page', d: 'פינה שמאלית תחתונה (מספר 3): אייקון המצב הנוכחי. הקשה (או החלקה לצד) פותחת את בורר המצבים.' });
node('lv_imgaudio', { en: 'Image/Audio Parameters', he: 'הגדרות תמונה ושמע', icon: 'sliders', type: 'page', d: 'ימין, באמצע (מספר 5): שני קווים עם נקודות. פותח את לוח התמונה והשמע: חשיפה, צמצם, צבע, גוון קולנועי ושמע. במצב PRO גם תריס, ISO ואיזון לבן.' });
node('lv_aperture', { en: 'Aperture Value', he: 'ערך הצמצם', icon: 'aperture', type: 'page', d: 'ימין, מתחת לאייקון הפרמטרים (מספר 6): למשל F2.8. הקשה פותחת את מצבי הצמצם המשתנה.' });
node('lv_specs', { en: 'Shooting Specifications', he: 'מפרט ההקלטה', icon: 'specs', type: 'page', d: 'למטה במרכז (מספר 7): למשל 4K30/RS/W = רזולוציה וקצב, ייצוב, שדה ראייה. הקשה (או החלקה למעלה) פותחת את הפרמטרים.' });
node('lv_zoom', { en: 'Zoom', he: 'זום', icon: 'zoom1x', type: 'list', conf: 'm', o: O(['1.0x', 'בלי זום (פי 1)'], ['2.0x', 'זום פי 2']), def: '1.0x',
  d: 'פינה ימנית תחתונה (מספר 8): 1x במסגרת. לחיצה כפולה על 1x מחליפה בין פי 1 לפי 2; לחצן QS (כשמוגדר Zoom) מבצע זום חלק. זום ללא אובדן איכות עד פי 2. לא זמין ב-38MP/34MP, SuperNight, מעקב אחרי נושא, הילוך איטי וטיימלאפס. עם עדשת המאקרו הזום מושבת.' });

/* ---------- מצבי צילום ---------- */
const MODES = ['m_track', 'm_hyper', 'm_tl', 'm_slow', 'm_video', 'm_photo', 'm_night', 'm_portrait'];
node('modes', { en: 'Shooting Modes', he: 'מצבי צילום', icon: 'video', type: 'page', kids: MODES,
  d: 'הבורר נפתח בהחלקה לצד. סדר המצבים בבורר עשוי להשתנות מעט בין גרסאות קושחה. מצבים מותאמים אישית (C1–C5) מופיעים לצידם.' });
node('m_video', { en: 'Video', he: 'וידאו', icon: 'video', d: 'הקלטת וידאו רגילה, עד 8K/30fps. כאן זמינים הקלטה מוקדמת, הקלטה במעגל, ייצוב ושדה ראייה.', kids: ['p_recmode', 'p_aspect', 'p_eisfov', 'p_res', 'p_fps'] });
node('m_photo', { en: 'Photo', he: 'תמונה', icon: 'photo', d: 'תמונות עד 38MP (7168×5376), כולל RAW, טיימר, צילום רציף ותמונה חיה (Live Photo).', kids: ['p_photosize', 'p_countdown', 'p_burst', 'p_format', 'p_live', 'p_pfov'] });
node('m_slow', { en: 'Slow Motion', he: 'הילוך איטי', icon: 'slow', d: 'הילוך איטי פי 4 (120fps) או פי 8 (1080p/240fps). בלי ייצוב. השמע נשמר כקובץ נפרד באותה תיקייה.', kids: ['p_slowrate', 'p_slowres', 'p_slowaspect'] });
node('m_hyper', { en: 'Hyperlapse', he: 'הייפרלאפס', icon: 'hyper', d: 'טיימלאפס בתנועה (ברכב, ביד). בוחרים מהירות.', kids: ['p_speed', 'p_tlres', 'p_tlfps'] });
node('m_tl', { en: 'Timelapse', he: 'טיימלאפס', icon: 'timelapse', d: 'טיימלאפס כשהמצלמה נייחת על חצובה. בלי ייצוב. אפשר לשמור גם את התמונות המקוריות.', kids: ['p_interval', 'p_duration', 'p_tlres', 'p_tlfps', 'p_tlaspect'] });
node('m_night', { en: 'SuperNight', he: 'לילה (SuperNight)', icon: 'moon', d: 'צילום בחושך עם פחות רעש, ISO עד 51200. עד 4K/60fps, 16:9 בלבד. ייצוב RockSteady/RockSteady+ בלבד, שדה ראייה: רגיל, רחב טבעי, רחב.', kids: ['p_neisfov', 'p_nres', 'p_nfps'] });
node('m_track', { en: 'Subject Tracking', he: 'מעקב אחרי נושא', icon: 'track', d: 'עוקב אחרי אדם ומשאיר אותו במרכז. במרכז המסך מופיעה מסגרת אפורה; כשאדם נמצא במרכז מופיע סביבו ריבוע צהוב, ובלחיצה על הקלטה הוא הופך לירוק (הנושא נעול). אם הנושא אובד הריבוע הופך לאדום. עד 2.7K/60fps, ביחס 16:9 או 9:16. מיועד לאנשים, לא לבעלי חיים. עובד רק כשהמצלמה מוחזקת לרוחב, ולא עם עדשת מאקרו.', kids: ['p_trres', 'p_traspect', 'p_trfps'] });
node('m_portrait', { en: 'Portrait', he: 'פורטרט', icon: 'portrait', d: 'מצב לצילום אנשים עם גווני עור משופרים (נוסף בקושחה 01.01.02.30). מצבי הצמצם: אוטומטי, קבוע f/2.8, אפקט אפקט כוכב f/4.0. לפי ביקורות: עד 4K/30fps ושדה ראייה ללא עיוות.', kids: ['p_aspect', 'p_eisfov', 'p_res', 'p_fps'] });

/* פרמטרים (החלקה למעלה) */
node('p_recmode', { en: 'Pre-Rec / Loop Recording', he: 'הקלטה מוקדמת / במעגל', icon: 'video', type: 'page', where: 'אריח שמאלי', kids: ['p_prerec', 'p_loop'], d: 'האריח השמאלי בלוח הפרמטרים, במצב וידאו בלבד (באקשן 5 פרו הוא היה גם במצב לילה). אפשר להפעיל רק אחת מהן בכל פעם.' });
node('p_eisfov', { en: 'EIS | FOV', he: 'ייצוב | שדה ראייה', icon: 'eis', type: 'page', where: 'אריח ימני (RS | Wide)', kids: ['p_eis', 'p_fov'], d: 'האריח הימני בלוח הפרמטרים. מציג בקיצור את הייצוב ושדה הראייה.' });
node('p_neisfov', { en: 'EIS | FOV', he: 'ייצוב | שדה ראייה', icon: 'eis', type: 'page', where: 'אריח ימני', kids: ['p_neis', 'p_nfov'], d: 'במצב לילה: RockSteady/RockSteady+ ושלושה שדות ראייה.' });
node('p_prerec', { en: 'Pre-Rec', he: 'הקלטה מוקדמת', icon: 'prerec', type: 'list', o: O(['Off', 'כבוי'], ['5s', '5 שניות'], ['10s', '10 שניות'], ['15s', '15 שניות'], ['30s', '30 שניות'], ['1min', 'דקה'], ['2min', '2 דק\''], ['5min', '5 דק\'']), def: 'Off',
  d: 'המצלמה מקליטה ברקע כל הזמן, וכשלוחצים הקלטה היא שומרת גם את השניות שלפני הלחיצה. מתאים לדיג ולרגעים לא צפויים.' });
node('p_loop', { en: 'Loop Recording', he: 'הקלטה במעגל', icon: 'loop', type: 'list', o: O(['Off', 'כבוי'], ['Max', 'מקסימום'], ['5min', '5 דק\''], ['20min', '20 דק\''], ['1h', 'שעה']), def: 'Off',
  d: 'המצלמה מקליטה ברצף ודורסת את הקטעים הישנים, כך שנשמרות רק הדקות האחרונות. מתאים לשימוש כמצלמת דרך ברכב. לא זמין ב-8K וב-4K Custom.' });
node('p_eis', { en: 'EIS', he: 'ייצוב תמונה', icon: 'eis', type: 'list',
  o: O(['Off', 'כבוי'], ['RockSteady', 'רוקסטדי'], ['RockSteady+', 'רוקסטדי פלוס'], ['HorizonBalancing', 'איזון אופק (±45°)'], ['HorizonSteady', 'יישור אופק (360°)']), def: 'RockSteady',
  d: 'כבוי: שדה הראייה הרחב ביותר. RockSteady: ייצוב רגיל ששומר על תחושת תנועה. RockSteady+: ייצוב חזק יותר, חותך מעט את השוליים. HorizonBalancing: מיישר הטיה עד ±45°. HorizonSteady: מיישר אופק ב-360°. איזון/יישור אופק רק ב-16:9 או 4K Custom עד 60fps. להקלטת נתוני ג\'יירו: ייצוב כבוי ושדה ראייה רחב (Wide).' });
node('p_fov', { en: 'FOV', he: 'שדה ראייה', icon: 'fov', type: 'list',
  o: O(['Ultra Wide', 'רחב במיוחד (155°)'], ['Wide', 'רחב'], ['Natural Wide', 'רחב טבעי'], ['Standard (Dewarp)', 'רגיל (ללא עיוות)']), def: 'Wide',
  d: 'Ultra Wide: הכי רחב, עם עיוות "עין דג". Natural Wide: רחב אבל מיישר קווים אנכיים (בניינים, עצים). Standard: מבטל את העיוות לגמרי וחותך יותר.' });
node('p_aspect', { en: 'Aspect Ratio', he: 'יחס תמונה', icon: 'aspect', type: 'list', where: 'אריח אמצעי', conf: 'm', o: O(['Auto', 'אוטומטי (לפי כיוון המצלמה)'], ['Landscape', 'לרוחב (נעול)'], ['Portrait', 'לאורך (נעול)'], ['Custom', 'מותאם (4K ריבועי 3840×3840)']), def: 'Auto',
  d: 'ברירת המחדל היא אוטומטי (Auto): כשהמצלמה לרוחב מקבלים 16:9 או 4:3, וכשהיא לאורך 9:16. לרוחב/לאורך נועלים את הכיוון בלי לסובב את המצלמה. מותאם (Custom) מצלם 4K ריבועי מלא, כדי לחתוך אחר כך ל-16:9 או ל-9:16 (ליוטיוב ולסטוריז).' });
node('p_res', { en: 'Resolution', he: 'רזולוציה', icon: 'res', type: 'list', o: O(['1080p/16:9', 'Full HD לרוחב (16:9)'], ['2.7K/16:9', '2.7K לרוחב (16:9)'], ['2.7K/4:3', '2.7K גבוה (4:3)'], ['4K/16:9', '4K לרוחב (16:9)'], ['4K/4:3', '4K גבוה (4:3)'], ['8K/16:9', '8K לרוחב (16:9), הכי חד'], ['1080p/9:16', 'Full HD לאורך (9:16)'], ['2.7K/9:16', '2.7K לאורך (9:16)'], ['4K/9:16', '4K לאורך (9:16)'], ['4K/1:1', '4K ריבועי (Custom)']), def: '4K/16:9',
  d: 'הגלגל העליון בלוח הפרמטרים: רזולוציה ויחס תמונה יחד. 8K ‏(7680×4320) רק ב-16:9 ועד 30fps, עם ייצוב RockSteady/RockSteady+ בלבד, שדה ראייה רגיל/רחב טבעי/רחב, בלי גוון קולנועי ועדיפות לאיכות, ו-ISO עד 12800. כשהמצלמה לאורך מופיעים 9:16.' });
node('p_fps', { en: 'Frame Rate', he: 'קצב פריימים', icon: 'fps', type: 'list', wheel: 1, o: O('24', '25', '30', '48', '50', '60', '100', '120', '200', '240'), def: '30',
  d: '100/120fps ב-4K ו-2.7K, ו-200/240fps רק ב-1080p. מ-100fps ומעלה אפשר ליצור אחר כך הילוך איטי במיוחד בגלריה. אין הגדרת מניעת הבהובים: היא פועלת אוטומטית לפי המדינה, עם התראה ב-25/50/100 או 30/60/120fps.' });
node('p_photosize', { en: 'Photo Size', he: 'גודל תמונה', icon: 'res', type: 'list', conf: 'm', o: O(['4:3 L', '4:3 גדול (38MP, ‏7168×5376)'], ['4:3 M', '4:3 בינוני'], ['16:9 L', '16:9 גדול (34MP = תמונת 8K, ‏7680×4320)'], ['16:9 M', '16:9 בינוני']), def: '4:3 L', d: 'יחס תמונה וגודל יחד. L ב-4:3 = 38MP (הרזולוציה המרבית 7168×5376), L ב-16:9 = 34MP (זו "תמונת 8K"). בגדלים L (38/34MP) אין זום.' });
node('p_countdown', { en: 'Countdown', he: 'טיימר', icon: 'timer', type: 'list', o: O(['Off', 'כבוי'], ['0.5s', 'חצי שנייה'], ['1s', 'שנייה'], ['2s', '2 שניות'], ['3s', '3 שניות'], ['5s', '5 שניות'], ['10s', '10 שניות']), def: 'Off', d: 'השהיה לפני הצילום.' });
node('p_burst', { en: 'Burst', he: 'צילום רציף', icon: 'burst', type: 'list', o: O(['Off', 'כבוי'], ['30 photos / 3s', '30 תמונות ב-3 שניות']), def: 'Off', d: 'עד 30 תמונות ב-3 שניות. כשהוא כבוי המצלמה מצלמת תמונה אחת.' });
node('p_format', { en: 'Photo Format', he: 'פורמט תמונה', icon: 'file', type: 'list', o: O(['JPEG', 'JPEG (תמונה רגילה)'], ['JPEG+RAW', 'JPEG + RAW (גם קובץ גולמי לעריכה)']), def: 'JPEG', d: 'RAW שומר את כל המידע לעריכה (DNG).' });
node('p_live', { en: 'Live Photo', he: 'תמונה חיה', icon: 'live', type: 'toggle', def: 'Off', d: 'שומרת קטע וידאו 4K קצר יחד עם התמונה (נוספה בקושחה 01.03.05.08). לא עובדת עם צילום רציף.' });
node('p_pfov', { en: 'FOV', he: 'שדה ראייה', icon: 'fov', type: 'list', o: O(['Ultra Wide', 'רחב במיוחד (155°)'], ['Wide', 'רחב'], ['Natural Wide', 'רחב טבעי'], ['Standard (Dewarp)', 'רגיל (ללא עיוות)']), def: 'Wide', d: 'כמו בווידאו.' });
node('p_slowrate', { en: 'Slow Motion Rate', he: 'קצב האטה', icon: 'slow', type: 'list', o: O(['4x (120fps)', 'פי 4 (120fps)'], ['8x (240fps)', 'פי 8 (240fps)']), def: '4x (120fps)', d: 'פי 8 רק ב-1080p.' });
node('p_slowres', { en: 'Resolution', he: 'רזולוציה', icon: 'res', type: 'list', d: 'חדות הסרטון. פי 8 (240fps) רק ב-1080p.', o: O(['4K', '4K (חד מאוד, 3840×2160)'], ['2.7K', '2.7K (חדות בינונית)'], ['1080p', '1080p (Full HD, קבצים קטנים)']), def: '4K' });
node('p_slowaspect', { en: 'Aspect Ratio', he: 'יחס תמונה', icon: 'aspect', type: 'list', o: O(['16:9', '16:9 לרוחב'], ['9:16', '9:16 לאורך']), def: '16:9', d: '9:16 נוסף בקושחה 01.01.02.30.' });
node('p_speed', { en: 'Speed', he: 'מהירות', icon: 'hyper', type: 'list', o: O(['Auto', 'אוטומטי'], ['x2', 'פי 2'], ['x5', 'פי 5'], ['x10', 'פי 10'], ['x15', 'פי 15'], ['x30', 'פי 30']), def: 'Auto', d: 'פי כמה הסרטון יהיה מהיר מהמציאות.' });
node('p_interval', { en: 'Interval', he: 'מרווח בין תמונות', icon: 'timer', type: 'list', o: O(['0.5s', 'חצי שנייה'], ['1s', 'שנייה'], ['2s', '2 שניות'], ['3s', '3 שניות'], ['4s', '4 שניות'], ['5s', '5 שניות'], ['6s', '6 שניות'], ['8s', '8 שניות'], ['10s', '10 שניות'], ['15s', '15 שניות'], ['20s', '20 שניות'], ['25s', '25 שניות'], ['30s', '30 שניות'], ['40s', '40 שניות'], ['1min', 'דקה'], ['2min', '2 דק\''], ['5min', '5 דק\''], ['30min', '30 דק\''], ['60min', '60 דק\'']), def: '3s',
  d: 'כל כמה זמן המצלמה מצלמת תמונה. לעננים ושקיעות: 3–5 שניות. לשמי כוכבים: 30 שניות.' });
node('p_duration', { en: 'Duration', he: 'משך הצילום', icon: 'clock', type: 'list', o: O(['5min', '5 דק\''], ['10min', '10 דק\''], ['20min', '20 דק\''], ['30min', '30 דק\''], ['1h', 'שעה'], ['2h', 'שעתיים'], ['3h', '3 שעות'], ['5h', '5 שעות'], ['∞', 'ללא הגבלה']), def: '30min', d: 'כמה זמן המצלמה תצלם.' });
node('p_tlres', { en: 'Resolution', he: 'רזולוציה', icon: 'res', type: 'list', o: O(['4K', '4K (חד מאוד, 3840×2160)'], ['2.7K', '2.7K (חדות בינונית)'], ['1080p', '1080p (Full HD, קבצים קטנים)']), def: '4K', d: 'חדות הסרטון המוגמר.' });
node('p_tlfps', { en: 'Frame Rate', he: 'קצב פריימים', icon: 'fps', type: 'list', o: O('25', '30'), def: '30', d: 'קצב הסרטון המוגמר.' });
node('p_tlaspect', { en: 'Aspect Ratio', he: 'יחס תמונה', icon: 'aspect', type: 'list', o: O(['16:9', '16:9 לרוחב'], ['9:16', '9:16 לאורך']), def: '16:9', d: '9:16 נוסף בקושחה 01.04.13.03.' });
node('p_neis', { en: 'EIS', he: 'ייצוב תמונה', icon: 'eis', type: 'list', o: O(['RockSteady', 'רוקסטדי'], ['RockSteady+', 'רוקסטדי פלוס']), def: 'RockSteady', d: 'במצב לילה אין איזון/יישור אופק.' });
node('p_nfov', { en: 'FOV', he: 'שדה ראייה', icon: 'fov', type: 'list', o: O(['Wide', 'רחב'], ['Natural Wide', 'רחב טבעי'], ['Standard (Dewarp)', 'רגיל (ללא עיוות)']), def: 'Wide', d: 'במצב לילה אין רחב במיוחד (155°).' });
node('p_nres', { en: 'Resolution', he: 'רזולוציה', icon: 'res', type: 'list', o: O(['4K', '4K (חד מאוד, 3840×2160)'], ['2.7K', '2.7K (חדות בינונית)'], ['1080p', '1080p (Full HD, קבצים קטנים)']), def: '4K', d: '16:9 בלבד.' });
node('p_nfps', { en: 'Frame Rate', he: 'קצב פריימים', icon: 'fps', type: 'list', o: O(...FPS_STD), def: '30', d: 'בחושך עדיף קצב נמוך: יותר אור לכל פריים. בתאורת חשמל בישראל (50Hz) עדיף 25 כדי למנוע הבהובים.' });
node('p_trres', { en: 'Resolution', he: 'רזולוציה', icon: 'res', type: 'list', o: O(['2.7K', '2.7K (חדות בינונית)'], ['1080p', '1080p (Full HD, קבצים קטנים)']), def: '2.7K', d: 'במעקב אחרי נושא אין 4K: עד 2.7K.' });
node('p_traspect', { en: 'Aspect Ratio', he: 'יחס תמונה', icon: 'aspect', type: 'list', o: O(['16:9', '16:9 לרוחב'], ['9:16', '9:16 לאורך']), def: '16:9', d: 'המצלמה נשארת לרוחב; 9:16 הוא חיתוך לאורך (לסטוריז).' });
node('p_trfps', { en: 'Frame Rate', he: 'קצב פריימים', icon: 'fps', type: 'list', o: O(...FPS_STD), def: '30', d: 'עד 60 פריימים בשנייה.' });

/* ---------- לוח תמונה ושמע ---------- */
node('imgaudio', { en: 'Image/Audio Settings', he: 'הגדרות תמונה ושמע', icon: 'sliders', type: 'page',
  d: 'נפתח מהאייקון בצד ימין של מסך הצילום. המתג PRO למעלה פותח שליטה ידנית.',
  kids: ['ia_pro', 'ia_exp', 'ia_shutter', 'ia_iso', 'ia_ev', 'ia_wb', 'ia_color', 'ia_recovery', 'ia_quality', 'ia_film', 'ia_film_str', 'ia_scenario', 'ia_aperture', 'ia_adjust', 'ia_peak', 'ia_channel', 'ia_wind'] });
node('ia_pro', { en: 'PRO', he: 'מצב מקצועי (PRO)', icon: 'pro', type: 'toggle', def: 'Off', d: 'מציג את כל האפשרויות הידניות: מצב חשיפה, תריס, ISO, איזון לבן והתאמות תמונה.' });
node('ia_exp', { en: 'Exposure', he: 'מצב חשיפה', icon: 'ev', type: 'list', pro: 1, o: O(['Auto', 'אוטומטי'], ['M', 'ידני (M)']), def: 'Auto', d: 'ב-M בוחרים תריס ו-ISO בעצמכם.' });
node('ia_shutter', { en: 'Shutter', he: 'מהירות תריס', icon: 'shutter', type: 'list', pro: 1, o: O(['Auto', 'אוטומטי'], '1/8000', '1/4000', '1/2000', '1/1000', '1/500', '1/250', '1/200', '1/120', '1/100', '1/60', '1/50', '1/30', '1/25', '1/24', '1/15', '1/8', '1/4', '1/2', '1s', '2s', '4s', '8s', '15s', '30s'), def: 'Auto', d: 'בווידאו: מ-1/8000 ועד 1/קצב הפריימים. בתמונה: עד 30 שניות. כלל אצבע לתנועה טבעית: תריס של 1 חלקי פעמיים קצב הפריימים (1/60 ב-30fps).' });
node('ia_iso', { en: 'ISO', he: 'ISO (רגישות)', icon: 'iso', type: 'list', pro: 1, o: O(['Auto', 'אוטומטי (אפשר להגביל טווח)'], '100', '200', '400', '800', '1600', '3200', '6400', '12800', '25600', '51200'), def: 'Auto', d: 'תמונה: 100–25600. וידאו: עד 25600 (51200 רק במצב לילה). ב-8K עד 12800 (6400 ב-D-Log M).' });
node('ia_ev', { en: 'EV', he: 'פיצוי חשיפה', icon: 'ev', type: 'list', o: O('-3.0', '-2.0', '-1.0', '-0.7', '-0.3', '0', '+0.3', '+0.7', '+1.0', '+2.0', '+3.0'), def: '0', d: 'מבהיר או מכהה את התמונה במצב אוטומטי. רבים מורידים ל-‎-0.3 כי ברירת המחדל בהירה.' });
node('ia_wb', { en: 'WB', he: 'איזון לבן', icon: 'wb', type: 'list', pro: 1, conf: 'm', o: O(['Auto', 'אוטומטי'], ['5000K', '5000K'], ['5100K', '5100K'], ['5600K', '5600K (שמש בצהריים)']), def: 'Auto', d: 'חיישן טמפרטורת הצבע שבחזית עוזר לאיזון האוטומטי, גם מתחת למים. לא לכסות אותו באצבע. בידני בוחרים ערך בקלווין בקפיצות של 100K (למשל 5000K, 5100K, 5600K).' });
node('ia_aperture', { en: 'Variable Aperture', he: 'צמצם משתנה', icon: 'aperture', type: 'list', kids: ['ap_auto', 'ap_large', 'ap_fixed', 'ap_star'], d: 'בחירת מצב הצמצם. המצבים הזמינים משתנים לפי מצב הצילום ולפי העדשה המחוברת.' });
node('ap_auto', { en: 'Auto', he: 'אוטומטי', icon: 'aperture', type: 'list', o: O(['f/2.0–f/4.0', 'טווח מלא f/2.0 עד f/4.0'], ['f/2.2–f/4.0', 'מ-f/2.2 עד f/4.0'], ['f/2.4–f/4.0', 'מ-f/2.4 עד f/4.0'], ['f/2.6–f/4.0', 'מ-f/2.6 עד f/4.0'], ['f/2.8–f/4.0', 'מ-f/2.8 עד f/4.0']), def: 'f/2.0–f/4.0', d: 'הצמצם משתנה לבד לפי האור, ונפתח לגמרי בחושך. אפשר להגביל את הטווח. זמין בתמונה, וידאו, פורטרט, מעקב, הילוך איטי והייפרלאפס.' });
node('ap_large', { en: 'Large Aperture (f/2.0)', he: 'צמצם פתוח (f/2.0)', icon: 'aperture', type: 'action', d: 'קבוע על f/2.0, הכי הרבה אור. זמין במצב SuperNight, ובכל המצבים כשעדשת המאקרו מחוברת (אז יש רק f/2.0 או אפקט כוכב f/4.0). עם עדשת FOV Boost אין f/2.0 מחוץ ל-SuperNight.' });
node('ap_fixed', { en: 'Fixed (f/2.8)', he: 'קבוע (f/2.8)', icon: 'aperture', type: 'action', d: 'קבוע על f/2.8 כמו מצלמת אקשן קלאסית. מרחק מיקוד מינימלי 35 ס"מ.' });
node('ap_star', { en: 'Starburst (f/4.0)', he: 'אפקט כוכב (f/4.0)', icon: 'star', type: 'action', d: 'קבוע על f/4.0: פנסים ונקודות אור יוצאים ככוכבים עם 6 קרניים. מיקוד מ-20 ס"מ.' });
node('ia_color', { en: 'Color', he: 'פרופיל צבע', icon: 'color', type: 'list', conf: 'm', o: O(['Normal 10-bit', 'רגיל 10 ביט'], ['D-Log M 10-bit', 'D-Log M ‏10 ביט (לעריכת צבע)']), def: 'Normal 10-bit', d: 'רגיל: מוכן לשימוש. בווידאו ההקלטה תמיד ב-10 ביט (אין בחירה של 8 ביט כמו ב-Action 5 Pro). D-Log M: תמונה "שטוחה" שנראית דהויה, עם טווח דינמי רחב לעריכת צבע (DJI מספקת LUT). D-Log M זמין רק בווידאו, הילוך איטי והייפרלאפס, ומבטל גוון קולנועי ועדיפות לאיכות.' });
node('ia_recovery', { en: 'Color Recovery', he: 'תצוגה מקדימה של הצבע', icon: 'color', type: 'toggle', conf: 'm', def: 'Off', d: 'רק ב-D-Log M: מציגה במסך איך ייראה הצבע אחרי תיקון, בלי לשנות את ההקלטה.' });
node('ia_film', { en: 'Film Tone', he: 'גוון קולנועי', icon: 'film', type: 'list', conf: 'm', o: O(['Off', 'כבוי'], ['CC', 'CC (גוונים קרים)'], ['NC', 'NC (נגטיב קלאסי)'], ['TR', 'TR (גווני עור טבעיים)'], ['WT', 'WT (גוונים חמים, אדריכלות)'], ['FE', 'FE (עומק קולנועי)'], ['NV', 'NV (וינטג׳ ענברי)']), def: 'Off', d: 'פילטרים מובנים בסגנון סרט צילום, עם עוצמה מתכווננת. מקושחה 01.02.05.21 גם במצב תמונה. רק ב-16:9 עד 4K/60 או 4:3 עד 4K/30. לא זמין ב-8K, ב-D-Log M, ב-Custom וב-9:16. במצב תמונה יש גוונים משלו (JPEG בלבד, קושחה 01.02.05.21).' });
node('ia_film_str', { en: 'Film Tone Intensity', he: 'עוצמת הגוון', icon: 'film', type: 'list', conf: 'm', o: O('0%', '10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%', '100%'), def: '50%', d: 'סליידר 0%–100% (ברירת מחדל 50%): כמה חזק הגוון הקולנועי. מופיע רק כשנבחר גוון.' });
node('ia_quality', { en: 'Quality Priority', he: 'עדיפות לאיכות', icon: 'quality', type: 'toggle', def: 'Off', d: 'משפרת את איכות התמונה בווידאו. לא זמין ב-8K וב-D-Log M.' });
node('ia_scenario', { en: 'Stabilization Scenario', he: 'תרחיש ייצוב', icon: 'eis', type: 'list', conf: 'm', o: O(['Daily', 'יומיומי'], ['Sports', 'ספורט']), def: 'Daily', d: 'מכוונן את הייצוב לסוג התנועה.' });
node('ia_adjust', { en: 'Image Adjustments', he: 'התאמות תמונה', icon: 'sharp', type: 'page', pro: 1, kids: ['ia_texture', 'ia_nr'], d: 'חדות (Texture) והפחתת רעש. מדריכים ממליצים ‎-1 או ‎-2 לשניהם לתמונה טבעית.' });
node('ia_texture', { en: 'Texture', he: 'חדות (טקסטורה)', icon: 'sharp', type: 'list', o: O('-2', '-1', '0', '+1', '+2'), def: '0', d: 'מינוס = תמונה רכה וטבעית יותר.' });
node('ia_nr', { en: 'Noise Reduction', he: 'הפחתת רעש', icon: 'noise', type: 'list', o: O('-2', '-1', '0', '+1', '+2'), def: '0', d: 'פלוס = פחות גרעיניות אבל פחות פרטים.' });
node('ia_peak', { en: 'Focus Peaking', he: 'הדגשת מיקוד', icon: 'focus', type: 'toggle', def: 'Off', d: 'רק עם עדשת מאקרו מחוברת: צובעת את האזורים שבמיקוד. בווידאו עד 30fps. בסימולטור השורה מוצגת כאילו עדשת המאקרו מחוברת.' });
node('ia_channel', { en: 'Channel', he: 'ערוצי שמע', icon: 'mic', type: 'list', conf: 'm', o: O(['Stereo', 'סטריאו'], ['Mono', 'מונו']), def: 'Stereo', d: 'חלק מקטע השמע (Audio).' });
node('ia_wind', { en: 'Wind Noise Reduction', he: 'הפחתת רעשי רוח', icon: 'wind', type: 'list', conf: 'm', o: O(['Off', 'כבוי'], ['Standard', 'רגיל'], ['High', 'גבוה']), def: 'Standard', d: 'מסננת רעשי רוח במיקרופונים המובנים.' });

/* ---------- מרכז הבקרה ---------- */
node('cc', { en: 'Control Center', he: 'מרכז הבקרה', icon: 'grid4', type: 'page', d: 'החלקה למטה מהחלק העליון של מסך הצילום. 8 כפתורים בשתי שורות. החלקה למעלה חוזרת.',
  kids: ['cc_custom', 'cc_qs', 'cc_gesture', 'cc_settings', 'cc_orient', 'cc_lock', 'cc_voice', 'cc_front', 'storage'] });
node('cc_custom', { en: 'Custom Modes', he: 'מצבים מותאמים אישית', icon: 'custom', type: 'page', kids: ['cu_save', 'cu_c1', 'cu_c2', 'cu_c3', 'cu_c4', 'cu_c5'], d: 'שמירת כל ההגדרות הנוכחיות כמצב מותאם ובחירת סצנה. המצבים מופיעים בבורר המצבים. (מספר המצבים המרבי והשמות C1–C5 לפי אקשן 4, לא אומתו לאקשן 6.)' });
node('cu_save', { en: 'Save Current Settings', he: 'שמירת ההגדרות הנוכחיות', icon: 'custom', type: 'action', d: 'יוצר מצב חדש או דורס מצב קיים.' });
['1', '2', '3', '4', '5'].forEach(n => node('cu_c' + n, { en: 'C' + n, he: 'מצב מותאם ' + n, icon: 'custom', type: 'action', conf: 'l', d: 'מצב שמור. הקשה מפעילה אותו.' }));
node('cc_qs', { en: 'Quick Switch', he: 'החלפה מהירה (QS)', icon: 'qs', type: 'page', kids: ['qs_feature', 'qs_modes'], d: 'קובעת מה עושה לחצן QS ואילו מצבים הוא מחליף ביניהם.' });
node('qs_feature', { en: 'Feature', he: 'פעולת הלחצן', icon: 'qs', type: 'list', o: O(['Switch Between Modes', 'מעבר בין מצבים'], ['Start/End Pre-Rec', 'התחלה/סיום הקלטה מוקדמת'], ['Lock Screen', 'נעילת מסך'], ['Screen Off', 'כיבוי מסך'], ['Zoom', 'זום']), def: 'Switch Between Modes', d: 'מה קורה בלחיצה קצרה על לחצן QS במסך הצילום. כיבוי מסך וזום נוספו בקושחה 01.02.05.21.' });
node('qs_modes', { en: 'Shooting Mode', he: 'מצבים בהחלפה המהירה', icon: 'video', type: 'page', kids: ['qs_prompt', 'qs_screen', 'qs_m_video', 'qs_m_photo', 'qs_m_slow', 'qs_m_tl', 'qs_m_hyper', 'qs_m_night', 'qs_m_track', 'qs_m_custom', 'qs_m_play'], d: 'סמנו את המצבים שלחצן QS יעבור ביניהם.' });
node('qs_prompt', { en: 'Voice Prompt', he: 'הכרזה קולית', icon: 'speaker', type: 'toggle', def: 'On', d: 'המצלמה מכריזה בקול על שם המצב בכל לחיצה על QS. שימושי כשהמצלמה על הקסדה.' });
node('qs_screen', { en: 'Screen Switch', he: 'החלפת מסך (קדמי/אחורי)', icon: 'front', type: 'toggle', def: 'On', d: 'לחיצה על QS עוברת גם בין המסך האחורי לקדמי.' });
[['video', 'Video', 'וידאו'], ['photo', 'Photo', 'תמונה'], ['slow', 'Slow Motion', 'הילוך איטי'], ['tl', 'Timelapse', 'טיימלאפס'], ['hyper', 'Hyperlapse', 'הייפרלאפס'], ['night', 'SuperNight', 'לילה'], ['track', 'Subject Tracking', 'מעקב אחרי נושא'], ['custom', 'Custom Modes', 'מצבים מותאמים'], ['play', 'Playback', 'גלריה']]
  .forEach(([k, en, he]) => node('qs_m_' + k, { en, he, icon: k === 'play' ? 'play' : k === 'custom' ? 'custom' : N['m_' + k] ? N['m_' + k].icon : 'video', type: 'toggle', def: k === 'video' || k === 'photo' || k === 'slow' ? 'On' : 'Off', d: 'כלול/לא כלול בסבב של לחצן QS.' }));
Object.assign(N.qs_m_custom, { conf: 'm', d: 'באקשן 6 כל מצב מותאם מופיע כשורה נפרדת בשמו (למשל Video 1), לא כמתג אחד.' });
node('cc_gesture', { en: 'Gesture Control', he: 'שליטה בתנועות יד', icon: 'hand', type: 'toggle', def: 'On', d: 'מופעל כברירת מחדל. מרימים כף יד פתוחה מול המצלמה (עד 2 מטר, גם עם כפפות חמש אצבעות) כדי להתחיל/לעצור הקלטה או לצלם. אפשר לקבוע שהתנועה רק מתחילה הקלטה, כדי לא לעצור בטעות. עובד גם במצלמת רשת, בשידור חי ובפלט למסך חיצוני.' });
node('cc_settings', { en: 'Settings', he: 'הגדרות מערכת', icon: 'gear', type: 'page', d: 'תפריט ההגדרות הכללי (אייקון 4 במרכז הבקרה).', kids: [] });
node('cc_orient', { en: 'Orientation Lock', he: 'נעילת כיוון מסך', icon: 'orient', type: 'toggle', def: 'Off', d: 'נועלת את הממשק בכיוון הנוכחי (לרוחב או לאורך) כדי שלא יסתובב.' });
node('cc_lock', { en: 'Screen Lock', he: 'נעילת מסך', icon: 'lock', type: 'toggle', def: 'Off', d: 'נועלת את מסך המגע מפני נגיעות בטעות (למשל בכיס או במים). משחררים בהחלקה למעלה מתחתית המסך.' });
node('cc_voice', { en: 'Voice Control', he: 'שליטה קולית', icon: 'voice', type: 'toggle', def: 'Off', d: 'פקודות באנגלית: Start Recording (התחלת הקלטה), Stop Recording (עצירת הקלטה), Take Photo (צילום תמונה), Shut Down (כיבוי). נתמכת גם סינית מנדרינית. מומלץ עד מטר מהמצלמה ובסביבה שקטה.' });
node('cc_front', { en: 'Full Front Screen', he: 'תצוגה מלאה במסך הקדמי', icon: 'front', type: 'toggle', def: 'Off', d: 'ממלאת את המסך הקדמי הריבועי בתמונה (חותך את השוליים) במקום להציג את כל הפריים.' });
node('storage', { en: 'Storage', he: 'אחסון', icon: 'sd', type: 'page', kids: ['st_loc', 'st_fmt_int', 'st_fmt_sd'], d: 'במרכז הבקרה: החלקה שמאלה. מציג מקום פנוי בזיכרון הפנימי (50GB) ובכרטיס.' });
node('st_loc', { en: 'Storage Location', he: 'מיקום שמירה', icon: 'sd', type: 'list', conf: 'm', o: O(['Internal Storage', 'זיכרון פנימי'], ['microSD Card', 'כרטיס microSD']), def: 'Internal Storage', d: 'לאן נשמרים הקבצים.' });
node('st_fmt_int', { en: 'Format Internal Storage', he: 'פרמוט הזיכרון הפנימי', icon: 'trash', type: 'action', danger: 1, d: 'מוחק לצמיתות את כל מה שבזיכרון הפנימי.' });
node('st_fmt_sd', { en: 'Format SD Card', he: 'פרמוט כרטיס הזיכרון', icon: 'trash', type: 'action', danger: 1, d: 'מוחק לצמיתות את כל מה שבכרטיס.' });

/* ---------- הגדרות מערכת ---------- */
const SET = ['s_snap', 's_single', 's_mic', 's_buds', 's_wifi', 's_depth', 's_scroff', 's_backup', 's_timer', 's_tc', 's_hl', 's_aod', 's_autooff', 's_bitrate', 's_sound', 's_grid', 's_horizon', 's_usb', 'storage', 's_lang', 's_info', 's_reset'];
N.cc_settings.kids = SET;
node('s_snap', { en: 'SnapShot', he: 'צילום מהיר (SnapShot)', icon: 'snap', type: 'list', o: O(['Last Settings', 'ההגדרות האחרונות'], ['Video', 'וידאו'], ['Photo', 'תמונה'], ['Hyperlapse', 'הייפרלאפס'], ['C1–C5', 'מצב מותאם C1–C5']), def: 'Last Settings', d: 'באיזה מצב המצלמה תקליט כשלוחצים על לחצן ההקלטה והיא כבויה.' });
node('s_mic', { en: 'Wireless Mic', he: 'מיקרופון אלחוטי', icon: 'micbox', type: 'page', kids: ['mic_tx1', 'mic_tx2', 'mic_set'], d: 'חיבור עד שני משדרי DJI Mic בבלוטות\'. המשדר יכול גם להתחיל הקלטה. נתמכים DJI Mic 3, Mic 2, Mic Mini, Mic Mini 2 ו-Mic Mini 2S. אין חיבור ישיר ל-DJI Mic מהדור הראשון (רק דרך מקלט בחיבור USB-C).' });
node('mic_tx1', { en: 'TX1', he: 'משדר 1', icon: 'mic', type: 'action', d: 'הקשה מכניסה למצב צימוד. פועלים לפי ההוראות במסך.' });
node('mic_tx2', { en: 'TX2', he: 'משדר 2', icon: 'mic', type: 'action', d: 'צימוד משדר שני.' });
node('mic_set', { en: 'Wireless Microphone Settings', he: 'הגדרות המיקרופון', icon: 'sliders', type: 'action', conf: 'm', d: 'מופיע רק אחרי שמשדר מחובר. מכוונים בו את פרמטרי השמע של המשדר: עוצמת ניטור, מסנן Low Cut, הפחתת רעש, מניעת עיוות (Clipping), בהירות הנורית וכיבוי אוטומטי של המשדר.' });
node('s_buds', { en: 'Wireless Earbuds', he: 'אוזניות אלחוטיות', icon: 'buds', type: 'action', d: 'מכניסים את האוזניות למצב צימוד ובוחרים אותן ברשימה. הן משמשות כמיקרופון בלבד, לא להשמעה.' });
node('s_wifi', { en: 'Wireless Connection', he: 'חיבור אלחוטי', icon: 'wifi', type: 'page', kids: ['wf_sw', 'wf_info', 'wf_freq', 'wf_reset'], d: 'החיבור לאפליקציית DJI Mimo הוא ב-Wi-Fi. בלוטות\' בטלפון רק חוסך את הקלדת הסיסמה. כאן גם מתג הכיבוי, פרטי הרשת, תדר ה-Wi-Fi ואיפוס.' });
node('wf_info', { en: 'Wireless Information', he: 'פרטי החיבור האלחוטי', icon: 'info', type: 'info', d: 'שם המכשיר ברשת ה-Wi-Fi והסיסמה, לחיבור ידני (למשל כשגם שלט GPS מחובר). את השם והסיסמה משנים רק מאפליקציית DJI Mimo.' });
node('wf_freq', { en: 'Wi-Fi Frequency', he: 'תדר Wi-Fi', icon: 'wifi', type: 'list', o: O(['Auto', 'אוטומטי'], ['2.4GHz', '2.4GHz (טווח רחוק יותר)'], ['5.8GHz', '5.8GHz (מהיר יותר)']), def: 'Auto', d: 'אם החיבור לאפליקציה לא יציב, אפשר לנסות תדר אחר.' });
node('wf_sw', { en: 'Wireless Connection', he: 'חיבור אלחוטי (מתג)', icon: 'wifi', type: 'toggle', def: 'On', d: 'כיבוי מנתק בבת אחת את ה-Wi-Fi ואת הבלוטות\': האפליקציה לא תמצא את המצלמה, ואי אפשר לחבר משדר DJI Mic ישירות. חוסך סוללה.' });
node('wf_reset', { en: 'Reset Wi-Fi Connection', he: 'איפוס חיבור ה-Wi-Fi', icon: 'reset', type: 'action', d: 'מאפס את כל החיבורים והסיסמאות של ה-Wi-Fi. תדר ה-Wi-Fi חוזר ל"אוטומטי" והשם נשאר. פותר בעיות חיבור לאפליקציה ולשלט ה-GPS.' });
node('s_depth', { en: 'Depth & Altitude', he: 'עומק וגובה', icon: 'depth', type: 'page', kids: ['dp_dive', 'dp_hike'], d: 'שומר נתוני עומק או גובה בסרטון, להצגה כלוח מחוונים באפליקציה.' });
node('dp_dive', { en: 'Diving', he: 'צלילה', icon: 'depth', type: 'page', kids: ['dp_depth', 'dp_auto'], d: 'הגדרות לצלילה.' });
node('dp_depth', { en: 'Depth Display', he: 'הצגת עומק', icon: 'depth', type: 'toggle', def: 'Off', d: 'בעומק של מטר ויותר מוצגים במסך העומק וזמן הצלילה. מד הלחץ עובד רק כשהמצלמה במים בלי קופסה אטומה.' });
node('dp_auto', { en: 'Auto Recording (Underwater)', he: 'הקלטה אוטומטית במים', icon: 'depth', type: 'toggle', def: 'Off', d: 'המצלמה מתחילה להקליט כשהיא נכנסת למים ועוצרת כשהיא יוצאת, לפי חיישן הלחץ. מופעל מעומק מטר, ורק בלי קופסה אטומה. (שם ההגדרה ומיקומה בתפריט לא אומתו.)' });
node('dp_hike', { en: 'Hiking & Parachuting', he: 'טיול וצניחה', icon: 'mountain', type: 'page', kids: ['dp_alt'], d: 'הגדרות לגובה.' });
node('dp_alt', { en: 'Altitude Display', he: 'הצגת גובה', icon: 'mountain', type: 'toggle', def: 'Off', d: 'מתחילים הקלטה ומוצג הגובה הנוכחי בזמן אמת.' });
node('s_backup', { en: 'Built-in Mic Audio Backup', he: 'גיבוי שמע במיקרופון המובנה', icon: 'backup', type: 'list', o: O(['Off', 'כבוי'], ['Separate File (.aac)', 'קובץ נפרד (‎.aac)'], ['Audio Track', 'ערוץ שמע נוסף בסרטון']), def: 'Off', d: 'כשמקליטים עם מיקרופון אלחוטי, המצלמה מקליטה במקביל גם מהמיקרופון שלה, למקרה שמשהו ישתבש.' });
node('s_tc', { en: 'Timecode', he: 'קוד זמן (Timecode)', icon: 'tc', type: 'page', kids: ['tc_show', 'tc_reset', 'tc_sync'], d: 'לסנכרון בין כמה מצלמות בעריכה. אפשר לסנכרן גם ממכשיר חיצוני דרך USB-C. לא זמין בהקלטה מעל 60fps. בדף קוד הזמן מוצג גם קצב הפריימים, כדי להגדיר אותו גם במחולל חיצוני (Tentacle, Deity, DJI Mic 3).' });
node('tc_show', { en: 'Timecode Display', he: 'הצגת קוד זמן', icon: 'tc', type: 'toggle', def: 'Off', d: 'מציגה את קוד הזמן במסך הצילום.' });
node('tc_reset', { en: 'Reset Timecode', he: 'איפוס קוד זמן', icon: 'reset', type: 'action', d: 'מאפס ל-00:00:00:00.' });
node('tc_sync', { en: 'Sync with System Time', he: 'סנכרון עם שעון המערכת', icon: 'clock', type: 'action', d: 'הסנכרון נעשה באייקון הרענון במסך. הוא מכוון את קוד הזמן לפי שעון המערכת, שמתעדכן מהטלפון כשמחוברים ל-DJI Mimo.' });
node('s_hl', { en: 'Intelligent Highlight', he: 'זיהוי רגעי שיא אוטומטי', icon: 'star', type: 'toggle', def: 'Off', d: 'המצלמה מסמנת לבד רגעים מעניינים בזמן ההקלטה לעריכה מהירה באפליקציה (קושחה 01.04.13.03).' });
node('s_scroff', { en: 'Scrn Off When Rec', he: 'כיבוי מסך בזמן הקלטה', icon: 'moon', type: 'list', conf: 'm', o: O(['Never', 'אף פעם'], ['1 min', 'אחרי דקה'], ['3 min', 'אחרי 3 דק\''], ['5 min', 'אחרי 5 דק\''], ['10 min', 'אחרי 10 דק\'']), def: '1 min', d: 'המסך נכבה בזמן הקלטה ארוכה כדי לחסוך סוללה וחום. ההקלטה ממשיכה. (רק האפשרות 10 דקות אומתה באקשן 6. שאר האפשרויות וברירת המחדל לא אומתו.)' });
node('s_autooff', { en: 'Auto Power Off', he: 'כיבוי אוטומטי', icon: 'power', type: 'list', conf: 'l', o: O(['Never', 'אף פעם'], ['1 min', 'דקה'], ['3 min', '3 דק\''], ['5 min', '5 דק\''], ['10 min', '10 דק\'']), def: '5 min', d: 'המצלמה נכבית אחרי זמן בלי שימוש.' });
node('s_bitrate', { en: 'Bitrate', he: 'קצב נתונים (איכות וידאו)', icon: 'bitrate', type: 'list', conf: 'm', o: O(['Standard', 'רגיל'], ['High', 'גבוה']), def: 'Standard', d: 'גבוה = פחות דחיסה, יותר פרטים, קבצים גדולים יותר (עד 120Mbps). מומלץ לבחור גבוה (High).' });
node('s_timer', { en: 'Timer Shooting', he: 'צילום מתוזמן', icon: 'timer', type: 'action', conf: 'm', d: 'פריט בתפריט ההגדרות של אקשן 6 (נראה בצילומי מסך של המצלמה). האפשרויות שבתוכו לא תועדו במקורות.' });
node('s_aod', { en: 'Always On Display', he: 'תצוגה תמידית', icon: 'screen', type: 'toggle', conf: 'm', def: 'Off', d: 'כשהמסך נכבה בזמן הקלטה, הוא ממשיך להציג את משך ההקלטה ומידע על המצב, כך שרואים שההקלטה עדיין רצה.' });
node('s_single', { en: 'Single Screen Preview (Scrn Off When Locked)', he: 'תצוגה במסך אחד', icon: 'single', type: 'toggle', def: 'Off', d: 'מופעל: רק מסך אחד דולק (האחורי או הקדמי), וכדי לעבור למסך השני מחליקים עליו למעלה. כבוי: התמונה מוצגת בשני המסכים יחד.' });
node('s_grid', { en: 'Grid', he: 'קווי עזר', icon: 'gridfill', type: 'list', conf: 'm', o: O(['Off', 'כבוי'], ['Grid', 'רשת'], ['Diagonals', 'אלכסונים'], ['Grid & Diagonals', 'רשת ואלכסונים']), def: 'Off', d: 'קווים על המסך לעזרה בקומפוזיציה. לא מוקלטים.' });
node('s_horizon', { en: 'Horizon Calibration', he: 'כיול אופק', icon: 'level', type: 'action', conf: 'l', d: 'מניחים את המצלמה על משטח ישר ומכיילים, אם האופק יוצא עקום.' });
node('s_sound', { en: 'Sounds', he: 'צלילים', icon: 'speaker', type: 'list', conf: 'm', o: O(['High', 'גבוה'], ['Medium', 'בינוני'], ['Low', 'נמוך'], ['Mute', 'מושתק']), def: 'Medium', d: 'צלילי לחיצה, צילום ותחילת הקלטה. ' });
node('s_usb', { en: 'USB Mode', he: 'מצב USB', icon: 'usb', type: 'action', d: 'אם המצלמה לא מזוהה כשמחברים לטלפון (OTG) או למחשב: מפעילים כאן ומחברים מחדש.' });
node('s_lang', { en: 'Language', he: 'שפה', icon: 'globe', type: 'list', conf: 'l', o: O(['English', 'אנגלית'], ['简体中文', 'סינית מפושטת'], ['繁體中文', 'סינית מסורתית'], ['日本語', 'יפנית'], ['한국어', 'קוריאנית'], ['ไทย', 'תאית'], ['العربية', 'ערבית'], ['Deutsch', 'גרמנית'], ['Español', 'ספרדית'], ['Français', 'צרפתית'], ['Italiano', 'איטלקית'], ['Русский', 'רוסית'], ['Português (Brasil)', 'פורטוגזית (ברזיל)'], ['Türkçe', 'טורקית'], ['Bahasa Indonesia', 'אינדונזית'], ['Polski', 'פולנית']), def: 'English', d: 'אין עברית במצלמה, ולכן האתר הזה.' });
node('s_info', { en: 'Device Info', he: 'מידע על המכשיר', icon: 'info', type: 'page', kids: ['in_fw', 'in_sn', 'in_logs', 'in_comp'], d: 'שם המכשיר, מספר סידורי, גרסת הקושחה, ייצוא יומנים ומידע רגולטורי.' });
node('in_fw', { en: 'Firmware Version', he: 'גרסת קושחה', icon: 'info', type: 'info', val: '01.05.08.03', d: 'הגרסה האחרונה נכון ליולי 2026. עדכון דרך אפליקציית DJI Mimo.' });
node('in_sn', { en: 'Serial Number', he: 'מספר סידורי', icon: 'tag', type: 'info', conf: 'l', d: 'המספר הסידורי של המצלמה, לאחריות ולתמיכה.' });
node('in_logs', { en: 'Export Logs', he: 'ייצוא קובצי יומן', icon: 'file', type: 'action', d: 'לשליחה לתמיכה של DJI. היומנים נשמרים לכרטיס microSD בלבד, ולכן צריך כרטיס בפנים.' });
node('in_comp', { en: 'Compliance Info', he: 'מידע רגולטורי', icon: 'info', type: 'info', conf: 'l', d: 'אישורי התקינה של המכשיר (רשויות תקשורת). (לפי אקשן 4, שם זו שורה נפרדת בהגדרות.)' });
node('s_reset', { en: 'Factory Reset', he: 'איפוס להגדרות היצרן', icon: 'reset', type: 'action', danger: 1, conf: 'm', d: 'מחזיר את כל ההגדרות לברירת המחדל ומוחק את המצבים המותאמים. המצלמה מופעלת מחדש. לגבי הקבצים אין מקור רשמי, לכן גבו לפני האיפוס.' });

/* ---------- גלריה ---------- */
node('playback', { en: 'Playback', he: 'גלריה', icon: 'play', type: 'page', kids: ['pb_hl', 'pb_slow', 'pb_del', 'pb_share', 'pb_vol'], d: 'החלקה שמאלה מהקצה הימני חוזרת למסך הצילום. העלאה לענן (OneDrive, Google Drive, NAS) ושידור חי נעשים מאפליקציית DJI Mimo, לא מתפריט המצלמה.' });
node('pb_hl', { en: 'Highlight', he: 'סימון רגע שיא', icon: 'star', type: 'action', d: 'מסמן רגע בסרטון כדי למצוא אותו מהר בעריכה באפליקציה.' });
node('pb_slow', { en: 'Super Slow-Motion', he: 'הילוך איטי במיוחד', icon: 'snail', type: 'action', d: 'אייקון החילזון: יוצר מהרגע הנבחר קטע הילוך איטי עד 960fps (פי 32). רק בסרטוני 16:9 שצולמו ב-100fps ומעלה, עד 6 קטעים לסרטון, לא ב-1.5 השניות הראשונות ו-2 האחרונות. התוצאה ב-1080p.' });
node('pb_del', { en: 'Delete', he: 'מחיקה', icon: 'trash', type: 'action', danger: 1, d: 'מוחקת את הקובץ (או קטע הילוך איטי שנוצר).' });
node('pb_share', { en: 'Share', he: 'שיתוף לטלפון', icon: 'share', type: 'action', d: 'העברה לטלפון אנדרואיד שתומך ב-MTA (Mutual Transfer Alliance).' });
node('pb_vol', { en: 'Volume', he: 'עוצמת שמע', icon: 'speaker', type: 'action', d: 'השתקה או שינוי עוצמה בצפייה.' });

/* ---------- חיבור USB ---------- */
node('usb', { en: 'USB Connection', he: 'חיבור בכבל USB', icon: 'usb', type: 'page', kids: ['usb_file', 'usb_cam', 'usb_dp'], d: 'חלון שקופץ כשמחברים למחשב.' });
node('usb_file', { en: 'Transfer File: USB', he: 'העברת קבצים', icon: 'file', type: 'action', d: 'המצלמה מופיעה במחשב ככונן (DCIM > DJI_001). בזמן העברה אי אפשר לצלם.' });
node('usb_dp', { en: 'DP Output', he: 'פלט למסך חיצוני (DisplayPort)', icon: 'screen', type: 'info', d: 'הצגת התמונה במסך חיצוני דרך USB-C (DisplayPort). שליטה בתנועות יד עובדת גם כאן (קושחה 01.02.05.21).' });
node('usb_cam', { en: 'Webcam', he: 'מצלמת רשת', icon: 'video', type: 'action', d: 'המצלמה משמשת כמצלמת רשת במחשב, עד 4K (נוסף בקושחה 01.04.13.03). בתחתית המסך יופיע Webcam.' });

const ROOTS = [
  ['גוף המצלמה, כפתורים ותנועות', ['rear_screen', 'front_screen', 'lens', 'ct_sensor', 'btn_shutter', 'btn_qs', 'g_down', 'g_up', 'g_side', 'g_long']],
  ['מסך הצילום', ['lv_storage', 'lv_battery', 'lv_playback', 'lv_mode', 'lv_imgaudio', 'lv_aperture', 'lv_specs', 'lv_zoom']],
  ['מצבי צילום והפרמטרים שלהם (החלקה לצד / למעלה)', MODES],
  ['לוח תמונה ושמע', ['imgaudio']],
  ['מרכז הבקרה (החלקה למטה)', ['cc']],
  ['גלריה', ['playback']],
  ['חיבור למחשב', ['usb']],
];
