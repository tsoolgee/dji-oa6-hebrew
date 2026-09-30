import sys; sys.path.insert(0, 'tools'); from _rep import apply, setline
apply([
 # 8: panel order (ia_pro kept as a row; see report)
 ("kids: ['ia_pro', 'ia_exp', 'ia_shutter', 'ia_iso', 'ia_ev', 'ia_wb', 'ia_aperture', 'ia_color', 'ia_recovery', 'ia_film', 'ia_film_str', 'ia_quality', 'ia_scenario', 'ia_texture', 'ia_nr', 'ia_peak', 'ia_channel', 'ia_wind']",
  "kids: ['ia_pro', 'ia_exp', 'ia_shutter', 'ia_iso', 'ia_ev', 'ia_wb', 'ia_color', 'ia_recovery', 'ia_quality', 'ia_film', 'ia_film_str', 'ia_scenario', 'ia_aperture', 'ia_adjust', 'ia_peak', 'ia_channel', 'ia_wind']"),
])
# 11 (+ hebrew-final rule-of-thumb wording)
setline('ia_shutter', "node('ia_shutter', { en: 'Shutter', he: 'מהירות תריס', icon: 'shutter', type: 'list', pro: 1, o: O(['Auto', 'אוטומטי'], '1/8000', '1/4000', '1/2000', '1/1000', '1/500', '1/250', '1/200', '1/120', '1/100', '1/60', '1/50', '1/30', '1/25', '1/24', '1/15', '1/8', '1/4', '1/2', '1s', '2s', '4s', '8s', '15s', '30s'), def: 'Auto', d: 'בווידאו: מ-1/8000 ועד 1/קצב הפריימים. בתמונה: עד 30 שניות. כלל אצבע לתנועה טבעית: תריס של 1 חלקי פעמיים קצב הפריימים (1/60 ב-30fps).' });")
# 2 + 12 (Auto label per hebrew-final 11)
setline('ia_iso', "node('ia_iso', { en: 'ISO', he: 'ISO (רגישות)', icon: 'iso', type: 'list', pro: 1, o: O(['Auto', 'אוטומטי (אפשר להגביל טווח)'], '100', '200', '400', '800', '1600', '3200', '6400', '12800', '25600', '51200'), def: 'Auto', d: 'תמונה: 100–25600. וידאו: עד 25600 (51200 רק במצב לילה). ב-8K עד 12800 (6400 ב-D-Log M).' });")
# 10 (+ hebrew-final he)
setline('ap_large', "node('ap_large', { en: 'Large Aperture (f/2.0)', he: 'צמצם פתוח (f/2.0)', icon: 'aperture', type: 'action', d: 'קבוע על f/2.0, הכי הרבה אור. זמין במצב SuperNight, ובכל המצבים כשעדשת המאקרו מחוברת (אז יש רק f/2.0 או כוכב f/4.0). עם עדשת FOV Boost אין f/2.0 מחוץ ל-SuperNight.' });")
# 1
setline('ia_color', "node('ia_color', { en: 'Color', he: 'פרופיל צבע', icon: 'color', type: 'list', conf: 'm', o: O(['Normal 10-bit', 'רגיל 10 ביט'], ['D-Log M 10-bit', 'D-Log M ‏10 ביט (לעריכת צבע)']), def: 'Normal 10-bit', d: 'רגיל: מוכן לשימוש. בווידאו ההקלטה תמיד ב-10 ביט (אין בחירה של 8 ביט כמו ב-Action 5 Pro). D-Log M: תמונה \"שטוחה\" שנראית דהויה, עם טווח דינמי רחב לעריכת צבע (DJI מספקת LUT). D-Log M זמין רק בווידאו, הילוך איטי והייפרלאפס, ומבטל גוון קולנועי ועדיפות לאיכות.' });")
# 9: Image Adjustments page
setline('ia_texture', "node('ia_adjust', { en: 'Image Adjustments', he: 'התאמות תמונה', icon: 'sharp', type: 'page', pro: 1, kids: ['ia_texture', 'ia_nr'], d: 'חדות (Texture) והפחתת רעש. מדריכים ממליצים ‎-1 או ‎-2 לשניהם לתמונה טבעית.' });\n"
 "node('ia_texture', { en: 'Texture', he: 'חדות (טקסטורה)', icon: 'sharp', type: 'list', o: O('-2', '-1', '0', '+1', '+2'), def: '0', d: 'מינוס = תמונה רכה וטבעית יותר.' });")
setline('ia_nr', "node('ia_nr', { en: 'Noise Reduction', he: 'הפחתת רעש', icon: 'noise', type: 'list', o: O('-2', '-1', '0', '+1', '+2'), def: '0', d: 'פלוס = פחות גרעיניות אבל פחות פרטים.' });")
# 13 (+ hebrew-final gender/wording)
setline('ia_peak', "node('ia_peak', { en: 'Focus Peaking', he: 'הדגשת מיקוד', icon: 'focus', type: 'toggle', def: 'Off', d: 'רק עם עדשת מאקרו מחוברת: צובעת את האזורים שבמיקוד. בווידאו עד 30fps. בסימולטור השורה מוצגת כאילו עדשת המאקרו מחוברת.' });")
# 16
setline('ia_channel', "node('ia_channel', { en: 'Channel', he: 'ערוצי שמע', icon: 'mic', type: 'list', conf: 'm', o: O(['Stereo', 'סטריאו'], ['Mono', 'מונו']), def: 'Stereo', d: 'חלק מקטע השמע (Audio).' });")
