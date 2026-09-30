import sys; sys.path.insert(0, 'tools'); from _rep import apply, setline
apply([
 # 1: s_unit removed (no source at all)
 ("node('s_unit', { en: 'Unit', he: 'יחידות מידה', icon: 'ruler', type: 'list', conf: 'l', o: O(['Metric (m)', 'מטרי (מטר)'], ['Imperial (ft)', 'אימפריאלי (רגל)']), def: 'Metric (m)', d: 'לעומק ולגובה.' });\n", ""),
 ("'s_unit', ", ""),
 # 15: custom modes
 ("d: 'שמירת כל ההגדרות הנוכחיות כמצב קבוע (עד 5) ובחירת סצנה. המצבים מופיעים בבורר המצבים.'",
  "d: 'שמירת כל ההגדרות הנוכחיות כמצב מותאם ובחירת סצנה. המצבים מופיעים בבורר המצבים. (מספר המצבים המרבי והשמות C1–C5 לפי אקשן 4, לא אומתו לאקשן 6.)'"),
 ("he: 'מצב מותאם ' + n, icon: 'custom', type: 'action',", "he: 'מצב מותאם ' + n, icon: 'custom', type: 'action', conf: 'l',"),
 ("d: 'כלול/לא כלול בסבב של לחצן QS.' }));\n",
  "d: 'כלול/לא כלול בסבב של לחצן QS.' }));\nObject.assign(N.qs_m_custom, { conf: 'm', d: 'באקשן 6 כל מצב מותאם מופיע כשורה נפרדת בשמו (למשל Video 1), לא כמתג אחד.' });\n"),
])
# 3: Depth & Altitude as two sub-menus (dp_auto kept, moved under Diving)
setline('s_depth', "node('s_depth', { en: 'Depth & Altitude', he: 'עומק וגובה', icon: 'depth', type: 'page', kids: ['dp_dive', 'dp_hike'], d: 'שומר נתוני עומק או גובה בסרטון, להצגה כלוח מחוונים באפליקציה.' });")
setline('dp_dive', "node('dp_dive', { en: 'Diving', he: 'צלילה', icon: 'depth', type: 'page', kids: ['dp_depth', 'dp_auto'], d: 'הגדרות לצלילה.' });\n"
 "node('dp_depth', { en: 'Depth Display', he: 'הצגת עומק', icon: 'depth', type: 'toggle', def: 'Off', d: 'בעומק של מטר ויותר מוצגים במסך העומק וזמן הצלילה. מד הלחץ עובד רק כשהמצלמה במים בלי קופסה אטומה.' });")
setline('dp_hike', "node('dp_hike', { en: 'Hiking & Parachuting', he: 'טיול וצניחה', icon: 'mountain', type: 'page', kids: ['dp_alt'], d: 'הגדרות לגובה.' });\n"
 "node('dp_alt', { en: 'Altitude Display', he: 'הצגת גובה', icon: 'mountain', type: 'toggle', def: 'Off', d: 'מתחילים הקלטה ומוצג הגובה הנוכחי בזמן אמת.' });")
# 13
setline('s_mic', "node('s_mic', { en: 'Wireless Microphone', he: 'מיקרופון אלחוטי', icon: 'mic', type: 'page', kids: ['mic_tx1', 'mic_tx2', 'mic_set'], d: 'חיבור עד שני משדרי DJI Mic בבלוטות\\'. המשדר יכול גם להתחיל הקלטה. נתמכים DJI Mic 3, Mic 2, Mic Mini, Mic Mini 2 ו-Mic Mini 2S. אין חיבור ישיר ל-DJI Mic מהדור הראשון (רק דרך מקלט בחיבור USB-C).' });")
# 12
setline('mic_set', "node('mic_set', { en: 'Wireless Microphone Settings', he: 'הגדרות המיקרופון', icon: 'sliders', type: 'action', conf: 'm', d: 'מופיע רק אחרי שמשדר מחובר. מכוונים בו את פרמטרי השמע של המשדר: עוצמת ניטור, מסנן Low Cut, הפחתת רעש, מניעת עיוות (Clipping), בהירות הנורית וכיבוי אוטומטי של המשדר.' });")
# 28
setline('s_wifi', "node('s_wifi', { en: 'Wireless Connection', he: 'חיבור אלחוטי', icon: 'wifi', type: 'page', kids: ['wf_sw', 'wf_info', 'wf_freq', 'wf_reset'], d: 'החיבור לאפליקציית DJI Mimo הוא ב-Wi-Fi. בלוטות\\' בטלפון רק חוסך את הקלדת הסיסמה. כאן גם מתג הכיבוי, פרטי הרשת, תדר ה-Wi-Fi ואיפוס.' });")
# 9
setline('wf_info', "node('wf_info', { en: 'Wireless Information', he: 'פרטי החיבור האלחוטי', icon: 'info', type: 'info', d: 'שם המכשיר ברשת ה-Wi-Fi והסיסמה, לחיבור ידני (למשל כשגם שלט GPS מחובר). את השם והסיסמה משנים רק מאפליקציית DJI Mimo.' });")
# 10 (+ hebrew-final he)
setline('wf_reset', "node('wf_reset', { en: 'Reset Wi-Fi Connection', he: 'איפוס חיבור ה-Wi-Fi', icon: 'reset', type: 'action', d: 'מאפס את כל החיבורים והסיסמאות של ה-Wi-Fi. תדר ה-Wi-Fi חוזר ל\"אוטומטי\" והשם נשאר. פותר בעיות חיבור לאפליקציה ולשלט ה-GPS.' });")
# 23
setline('s_tc', "node('s_tc', { en: 'Timecode', he: 'קוד זמן (Timecode)', icon: 'tc', type: 'page', kids: ['tc_show', 'tc_reset', 'tc_sync'], d: 'לסנכרון בין כמה מצלמות בעריכה. אפשר לסנכרן גם ממכשיר חיצוני דרך USB-C. לא זמין בהקלטה מעל 60fps. בדף קוד הזמן מוצג גם קצב הפריימים, כדי להגדיר אותו גם במחולל חיצוני (Tentacle, Deity, DJI Mic 3).' });")
setline('tc_sync', "node('tc_sync', { en: 'Sync with System Time', he: 'סנכרון עם שעון המערכת', icon: 'clock', type: 'action', d: 'הסנכרון נעשה באייקון הרענון במסך. הוא מכוון את קוד הזמן לפי שעון המערכת, שמתעדכן מהטלפון כשמחוברים ל-DJI Mimo.' });")
# 22
setline('s_scroff', "node('s_scroff', { en: 'Screen Off When Recording', he: 'כיבוי מסך בזמן הקלטה', icon: 'screen', type: 'list', conf: 'm', o: O(['Never', 'אף פעם'], ['1min', 'אחרי דקה'], ['3min', 'אחרי 3 דק\\''], ['5min', 'אחרי 5 דק\\''], ['10min', 'אחרי 10 דק\\'']), def: '1min', d: 'המסך נכבה בזמן הקלטה ארוכה כדי לחסוך סוללה וחום. ההקלטה ממשיכה. (רק האפשרות 10 דקות אומתה באקשן 6. שאר האפשרויות וברירת המחדל לא אומתו.)' });")
# 18
setline('s_aod', "node('s_aod', { en: 'Always On Display', he: 'תצוגה תמידית', icon: 'screen', type: 'toggle', conf: 'm', def: 'Off', d: 'כשהמסך נכבה בזמן הקלטה, הוא ממשיך להציג את משך ההקלטה ומידע על המצב, כך שרואים שההקלטה עדיין רצה.' });")
# 20
setline('s_sound', "node('s_sound', { en: 'Sound', he: 'צלילים', icon: 'speaker', type: 'list', conf: 'm', o: O(['High', 'גבוה'], ['Medium', 'בינוני'], ['Low', 'נמוך'], ['Mute', 'מושתק']), def: 'Medium', d: 'צלילי לחיצה, צילום ותחילת הקלטה. (האפשרויות לפי אקשן 4.)' });")
# 24 (d per oa5-contamination item 13)
setline('s_lang', "node('s_lang', { en: 'Language', he: 'שפה', icon: 'globe', type: 'list', conf: 'l', o: O(['English', 'אנגלית'], ['简体中文', 'סינית מפושטת'], ['繁體中文', 'סינית מסורתית'], ['日本語', 'יפנית'], ['한국어', 'קוריאנית'], ['ไทย', 'תאית'], ['العربية', 'ערבית'], ['Deutsch', 'גרמנית'], ['Español', 'ספרדית'], ['Français', 'צרפתית'], ['Italiano', 'איטלקית'], ['Русский', 'רוסית'], ['Português (Brasil)', 'פורטוגזית (ברזיל)'], ['Türkçe', 'טורקית'], ['Bahasa Indonesia', 'אינדונזית'], ['Polski', 'פולנית']), def: 'English', d: 'אין עברית במצלמה, ולכן האתר הזה.' });")
# 16
setline('s_reset', "node('s_reset', { en: 'Factory Reset', he: 'איפוס להגדרות היצרן', icon: 'reset', type: 'action', danger: 1, conf: 'm', d: 'מחזיר את כל ההגדרות לברירת המחדל ומוחק את המצבים המותאמים. המצלמה מופעלת מחדש. לגבי הקבצים אין מקור רשמי, לכן גבו לפני האיפוס.' });")
