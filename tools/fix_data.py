# תיקוני נתונים ותרגום לפי דוחות הבודקים (הרצה חד-פעמית)
import pathlib, re
p = pathlib.Path(__file__).parent.parent / 'src/data.js'
s = p.read_text(encoding='utf-8')

def rep(a, b):
    global s
    assert a in s, 'MISSING: ' + a[:80]
    s = s.replace(a, b, 1)

def setnode(id_, new):
    global s
    m = re.search(r"node\('" + re.escape(id_) + r"', \{.*?\}\);\n", s, re.S)
    assert m, id_
    s = s[:m.start()] + (new.strip('\n') + '\n' if new else '') + s[m.end():]

setnode('qs_feature', r"""node('qs_feature', { en: 'Feature', he: 'פעולת הלחצן', icon: 'qs', type: 'list', o: O(['Switch Between Modes', 'מעבר בין מצבים'], ['Start/End Pre-Rec', 'התחלה/סיום הקלטה מוקדמת'], ['Lock Screen', 'נעילת מסך'], ['Screen Off', 'כיבוי מסך'], ['Zoom', 'זום']), def: 'Switch Between Modes', d: 'מה קורה בלחיצה קצרה על לחצן QS במסך הצילום. כיבוי מסך וזום נוספו בקושחה 01.02.05.21.' });""")
setnode('p_aspect', r"""node('p_aspect', { en: 'Aspect Ratio', he: 'יחס תמונה', icon: 'aspect', type: 'list', o: O(['Auto', 'אוטומטי (לפי כיוון המצלמה)'], ['16:9', '16:9 לרוחב'], ['4:3', '4:3'], ['9:16', '9:16 לאורך'], ['Custom', 'מותאם (4K ריבועי 3840×3840)']), def: 'Auto',
  d: 'ברירת המחדל Auto: לרוחב כשהמצלמה מותקנת לרוחב, לאורך כשהיא לאורך. Custom מצלם 4K ריבועי מלא כדי לחתוך אחר כך לרוחב או לאורך. 8K רק ב-16:9.' });""")
setnode('ia_film', r"""node('ia_film', { en: 'Film Tone', he: 'גוון קולנועי', icon: 'film', type: 'list', conf: 'm', o: O(['Off', 'כבוי'], ['CC', 'CC (גוונים קרים)'], ['NC', 'NC (נגטיב קלאסי)'], ['TR', 'TR (גווני עור טבעיים)'], ['WT', 'WT (גוונים חמים)'], ['FE', 'FE (עומק קולנועי)'], ['NV', 'NV (וינטג׳ ענברי)']), def: 'Off', d: 'פילטרים מובנים בסגנון סרט צילום, עם עוצמה מתכווננת. רק ב-16:9 עד 4K/60 או 4:3 עד 4K/30. לא זמין ב-8K וב-D-Log M. במצב תמונה יש גוונים משלו (JPEG בלבד, קושחה 01.02.05.21).' });
node('ia_film_str', { en: 'Film Tone Intensity', he: 'עוצמת הגוון', icon: 'film', type: 'list', conf: 'm', o: O('30%', '50%', '70%', '100%'), def: '50%', d: 'כמה חזק הגוון הקולנועי.' });""")
setnode('ia_color', r"""node('ia_color', { en: 'Color', he: 'פרופיל צבע', icon: 'color', type: 'list', conf: 'm', o: O(['Normal', 'רגיל'], ['Normal 10-bit', 'רגיל 10 ביט'], ['D-Log M 10-bit', 'D-Log M ‏10 ביט (לעריכת צבע)']), def: 'Normal', d: 'רגיל: מוכן לשימוש. 10 ביט: יותר גוונים ומעברים חלקים. D-Log M: תמונה "שטוחה" שנראית דהויה, עם טווח דינמי רחב לעריכת צבע (DJI מספקת LUT). D-Log M זמין רק בווידאו, הילוך איטי והייפרלאפס, ומבטל גוון קולנועי ועדיפות לאיכות.' });
node('ia_recovery', { en: 'Color Recovery', he: 'תצוגה מקדימה של הצבע', icon: 'color', type: 'toggle', conf: 'm', def: 'Off', d: 'רק ב-D-Log M: מציג במסך איך ייראה הצבע אחרי תיקון, בלי לשנות את ההקלטה.' });""")
setnode('ia_10bit', '')
rep("'ia_color', 'ia_10bit', 'ia_film',", "'ia_color', 'ia_recovery', 'ia_film', 'ia_film_str',")
rep("conf: 'l', o: O(['Daily', 'יומיומי'], ['Sports', 'ספורט'])", "conf: 'm', o: O(['Daily', 'יומיומי'], ['Sports', 'ספורט'])")
rep("o: O(['Auto 100–12800', 'אוטומטי 100–12800'],", "o: O(['Auto', 'אוטומטי (100–12800)'],")
setnode('cc_gesture', r"""node('cc_gesture', { en: 'Gesture Control', he: 'שליטה בתנועות יד', icon: 'hand', type: 'toggle', def: 'Off', d: 'מרימים כף יד פתוחה מול המצלמה (עד 2 מטר, גם עם כפפות) כדי להתחיל/לעצור הקלטה או לצלם. אפשר לקבוע שהתנועה רק מתחילה הקלטה, כדי לא לעצור בטעות. עובד גם במצלמת רשת, בשידור חי ובפלט למסך חיצוני.' });""")
rep("משחררים בהחלקה.'", "משחררים בהחלקה למעלה מתחתית המסך.'")
rep("נתמכות גם פקודות בסינית.'", "נתמכות גם פקודות בסינית. מומלץ עד מטר מהמצלמה ובסביבה שקטה.'")
rep("'s_scroff', 's_autooff', 's_bright', 's_bitrate', 's_flicker', 's_grid',", "'s_scroff', 's_aod', 's_single', 's_autooff', 's_bright', 's_bitrate', 's_grid',")
setnode('s_flicker', r"""node('s_aod', { en: 'Always On Display', he: 'תצוגה תמידית', icon: 'screen', type: 'toggle', conf: 'm', def: 'Off', d: 'כשהמסך נכבה בזמן הקלטה, שני המסכים ממשיכים להציג באור עמום את משך ההקלטה ואת נתוני הצילום.' });
node('s_single', { en: 'Single Screen Preview', he: 'תצוגה במסך אחד', icon: 'front', type: 'toggle', conf: 'm', def: 'Off', d: 'מופעל: רק מסך אחד דולק (האחורי או הקדמי), וכדי לעבור למסך השני מחליקים עליו למעלה. כבוי: התמונה מוצגת בשני המסכים יחד. (אין הגדרת מניעת הבהובים: DJI הסירה אותה והיא פועלת אוטומטית לפי המדינה.)' });""")
rep("o: O(['Last Settings', 'ההגדרות האחרונות'], ['Video', 'וידאו'], ['Hyperlapse', 'הייפרלאפס'],", "o: O(['Last Settings', 'ההגדרות האחרונות'], ['Video', 'וידאו'], ['Photo', 'תמונה'], ['Hyperlapse', 'הייפרלאפס'],")
setnode('s_grid', r"""node('s_grid', { en: 'Reference Line', he: 'קווי עזר', icon: 'gridline', type: 'list', conf: 'm', o: O(['Off', 'כבוי'], ['Grid', 'רשת'], ['Diagonals', 'אלכסונים'], ['Grid & Diagonals', 'רשת ואלכסונים']), def: 'Off', d: 'קווים על המסך לעזרה בקומפוזיציה. לא מוקלטים. (האפשרויות לפי אקשן 4.)' });""")
setnode('s_bright', r"""node('s_bright', { en: 'Brightness', he: 'בהירות מסך', icon: 'sun', type: 'info', conf: 'l', d: 'בהירות עד 800 ניט (1000 בשיא). באקשן 4 ו-5 פרו זה סליידר במרכז הבקרה; באקשן 6 המשבצת הוחלפה בשליטה בתנועות יד, ומיקום הבהירות לא אומת.' });""")
rep("'Português', 'Русский', 'ไทย'), def: 'English', d: 'אין עברית במצלמה, ולכן האתר הזה.'", "'Português (Brasil)', 'Русский', 'ไทย', 'العربية', 'Türkçe', 'Bahasa Indonesia', 'Polski'), def: 'English', d: 'אין עברית במצלמה, ולכן האתר הזה. (הרשימה לפי אקשן 4.)'")
rep("node('s_lang', { en: 'Language', he: 'שפה', icon: 'globe', type: 'list', conf: 'm',", "node('s_lang', { en: 'Language', he: 'שפה', icon: 'globe', type: 'list', conf: 'l',")
rep("type: 'page', kids: ['wf_sw', 'wf_reset'],", "type: 'page', kids: ['wf_sw', 'wf_info', 'wf_freq', 'wf_reset'],")
rep("node('wf_sw', { en: 'Wireless Connection', he: 'חיבור אלחוטי (מתג)', icon: 'wifi', type: 'toggle', def: 'On',",
    "node('wf_info', { en: 'Wireless Information', he: 'פרטי החיבור האלחוטי', icon: 'info', type: 'info', conf: 'm', d: 'שם הרשת (Wi-Fi) והסיסמה של המצלמה, לחיבור ידני.' });\n"
    "node('wf_freq', { en: 'Wi-Fi Frequency', he: 'תדר Wi-Fi', icon: 'wifi', type: 'list', conf: 'm', o: O(['Auto', 'אוטומטי'], '2.4GHz', '5.8GHz'), def: 'Auto', d: 'אם החיבור לאפליקציה לא יציב, אפשר לנסות תדר אחר.' });\n"
    "node('wf_sw', { en: 'Wireless Connection', he: 'חיבור אלחוטי (מתג)', icon: 'wifi', type: 'toggle', conf: 'l', def: 'On',")
rep("node('wf_reset', { en: 'Reset Connection',", "node('wf_reset', { en: 'Reset Wi-Fi Connection',")
rep("type: 'page', kids: ['dp_dive', 'dp_hike'],", "type: 'page', kids: ['dp_dive', 'dp_hike', 'dp_auto'],")
rep("node('dp_hike',", "node('dp_auto', { en: 'Auto Recording (Underwater)', he: 'הקלטה אוטומטית במים', icon: 'depth', type: 'toggle', conf: 'm', def: 'Off', d: 'המצלמה מתחילה להקליט כשנכנסים למים ועוצרת כשיוצאים (לפי חיישן הלחץ). לא עם קופסה אטומה.' });\nnode('dp_hike',")
rep("kids: ['usb_file', 'usb_cam'],", "kids: ['usb_file', 'usb_cam', 'usb_dp'],")
rep("node('usb_cam',", "node('usb_dp', { en: 'DP Output', he: 'פלט למסך חיצוני (DisplayPort)', icon: 'screen', type: 'info', conf: 'm', d: 'הצגת התמונה במסך חיצוני דרך USB-C.' });\nnode('usb_cam',")
rep("node('mic_32', { en: '32bit Float', he: 'הקלטת 32 ביט צף', icon: 'mic', type: 'toggle', def: 'Off',", "node('mic_32', { en: '32bit Float', he: 'הקלטה ב-32 ביט (Float)', icon: 'mic', type: 'toggle', conf: 'l', def: 'Off',")
rep("node('mic_tx1', { en: 'TX1', he: 'משדר 1', icon: 'mic', type: 'action',", "node('mic_tx1', { en: 'TX1', he: 'משדר 1', icon: 'mic', type: 'action', conf: 'm',")
rep("node('mic_tx2', { en: 'TX2', he: 'משדר 2', icon: 'mic', type: 'action',", "node('mic_tx2', { en: 'TX2', he: 'משדר 2', icon: 'mic', type: 'action', conf: 'm',")
rep("icon: 'bars', type: 'list', o: O(['Standard', 'רגיל'], ['High', 'גבוה'])", "icon: 'bars', type: 'list', conf: 'm', o: O(['Standard', 'רגיל'], ['High', 'גבוה'])")
rep("node('s_name', { en: 'Device Name', he: 'שם המכשיר', icon: 'tag', type: 'info',", "node('s_name', { en: 'Device Name', he: 'שם המכשיר', icon: 'tag', type: 'info', conf: 'l',")
rep("node('in_sn', { en: 'Serial Number', he: 'מספר סידורי', icon: 'tag', type: 'info',", "node('in_sn', { en: 'Serial Number', he: 'מספר סידורי', icon: 'tag', type: 'info', conf: 'l',")
rep("המשדר יכול גם להתחיל הקלטה.'", "המשדר יכול גם להתחיל הקלטה. נתמכים DJI Mic 3, Mic 2 ו-Mic Mini (לא Mic מהדור הראשון).'")
rep("d: 'לשליחה לתמיכה של DJI.'", "d: 'לשליחה לתמיכה של DJI. היומנים נשמרים לכרטיס microSD בלבד, ולכן צריך כרטיס בפנים.'")
rep("he: 'ייצוא יומני תקלות'", "he: 'ייצוא קובצי יומן'")
rep("דרך USB-C.' });\nnode('tc_show'", "דרך USB-C. לא זמין בהקלטה מעל 60fps.' });\nnode('tc_show'")
rep("ואז מצלמים בלחצן QS.'", "ואז לחיצה על QS מצלמת או מקליטה, ולחיצה כפולה פותחת את ההחלפה המהירה. לחיצה ארוכה של 5 שניות מכניסה ידנית למצב צלילה.'")
rep("עם ייצוב RockSteady/RockSteady+ בלבד ובלי גוון קולנועי.'", "עם ייצוב RockSteady/RockSteady+ בלבד, שדה ראייה רגיל/רחב טבעי/רחב, בלי גוון קולנועי ועדיפות לאיכות, ו-ISO עד 12800.'")
rep("מיועד לאנשים, לא לבעלי חיים.'", "מיועד לאנשים, לא לבעלי חיים. רק כשהמצלמה לרוחב, ולא עם עדשת מאקרו.'")
rep("['HorizonBalancing', 'איזון אופק'], ['HorizonSteady', 'אופק יציב']", "['HorizonBalancing', 'איזון אופק (±45°)'], ['HorizonSteady', 'יישור אופק (360°)']")
rep("he: 'הפעלה / גלריה'", "he: 'גלריה'")
rep("he: 'לחיצה ארוכה בהפעלה'", "he: 'לחיצה ארוכה בזמן צפייה'")
rep("['play', 'Playback', 'הפעלה/גלריה']", "['play', 'Playback', 'גלריה']")
rep("he: 'גלריה והפעלה'", "he: 'גלריה'")
rep("o: O(['Auto', 'אוטומטי'], 'x2', 'x5', 'x10', 'x15', 'x30')", "o: O(['Auto', 'אוטומטי'], ['x2', 'פי 2'], ['x5', 'פי 5'], ['x10', 'פי 10'], ['x15', 'פי 15'], ['x30', 'פי 30'])")
rep("עד 1000 ניט. כאן כל התפריטים.'", "בהירות 800 ניט (1000 בשיא). גם המסך הקדמי מציג את אותם תפריטים. החלקה למעלה מתחתית מסך מעירה אותו.'")
rep("לצילום עצמי וולוג.", "לצילום עצמי ולוולוג, בהירות 800 ניט.")
rep("במקומו אפשר להבריג עדשת מאקרו או עדשת FOV Boost.'", "במקומו אפשר להבריג עדשת מאקרו (מיקוד 11–75 ס\"מ, לא אטומה למים) או עדשת FOV Boost ‏(182°, בלי הילוך איטי).'")
rep("d: 'החלקה שמאלה מהקצה הימני חוזרת למסך הצילום.' });", "d: 'החלקה שמאלה מהקצה הימני חוזרת למסך הצילום. העלאה לענן (OneDrive, Google Drive, NAS) ושידור חי נעשים מאפליקציית DJI Mimo, לא מתפריט המצלמה.' });")
# פעלים בנקבה לפעולות ("החלקה ... פותחת")
for a, b in [("מהחלק העליון של המסך: פותח", "מהחלק העליון של המסך: פותחת"), ("מהחלק התחתון של המסך: פותח", "מהחלק התחתון של המסך: פותחת"), ("במסך הצילום: פותח את בורר", "במסך הצילום: פותחת את בורר"), ("לחיצה ארוכה על אזור ריק מנגנת", "לחיצה ארוכה על אזור ריק מנגנת")]:
    if a in s: s = s.replace(a, b)
p.write_text(s, encoding='utf-8')
print('data ok')
