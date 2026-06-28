/* ============================================================
   i18n.js — English / Spanish / Farsi language toggle
   - Injects a language switcher into the top bar
   - Translates static + JS-rendered text via a dictionary
   - Handles right-to-left layout + Persian font for Farsi
   - Remembers the choice in localStorage
   ============================================================ */
(function () {
  "use strict";

  const LANGS = {
    en: { label: "EN", name: "English", dir: "ltr" },
    es: { label: "ES", name: "Español", dir: "ltr" },
    fa: { label: "فارسی", name: "Farsi", dir: "rtl" },
  };

  /* ---- Dictionary: normalized English -> { es, fa } ---- */
  const DICT = {
    // ---------- Chrome: top bar / nav / footer ----------
    "District Site": { es: "Sitio del Distrito", fa: "وب‌سایت منطقه" },
    "Home": { es: "Inicio", fa: "خانه" },
    "This Week": { es: "Esta Semana", fa: "این هفته" },
    "Calendar": { es: "Calendario", fa: "تقویم" },
    "Newsletters": { es: "Boletines", fa: "خبرنامه‌ها" },
    "Staff Directory": { es: "Directorio del Personal", fa: "فهرست کارکنان" },
    "Supply Lists": { es: "Listas de Útiles", fa: "فهرست لوازم" },
    "📅 This Week": { es: "📅 Esta Semana", fa: "📅 این هفته" },
    "Onward & Upward": { es: "Adelante y Hacia Arriba", fa: "رو به جلو و رو به بالا" },
    "Onward and Upward": { es: "Adelante y Hacia Arriba", fa: "رو به جلو و رو به بالا" },
    "Onward and Upward.": { es: "Adelante y Hacia Arriba.", fa: "رو به جلو و رو به بالا." },
    "For Families": { es: "Para las Familias", fa: "برای خانواده‌ها" },
    "What's Happening": { es: "Qué Está Pasando", fa: "چه خبر است" },
    "Monthly Calendar": { es: "Calendario Mensual", fa: "تقویم ماهانه" },
    "Class Newsletters": { es: "Boletines de Clase", fa: "خبرنامه‌های کلاس" },
    "Quick Links": { es: "Enlaces Rápidos", fa: "پیوندهای سریع" },
    "Transportation ↗": { es: "Transporte ↗", fa: "حمل و نقل ↗" },
    "Lunch Menus ↗": { es: "Menús de Almuerzo ↗", fa: "منوی ناهار ↗" },
    "Registration ↗": { es: "Inscripción ↗", fa: "ثبت‌نام ↗" },
    "District Calendar ↗": { es: "Calendario del Distrito ↗", fa: "تقویم منطقه ↗" },
    "District": { es: "Distrito", fa: "منطقه" },
    "MSCS Home ↗": { es: "Inicio de MSCS ↗", fa: "خانه MSCS ↗" },
    "Students & Parents ↗": { es: "Estudiantes y Padres ↗", fa: "دانش‌آموزان و والدین ↗" },
    "Health Services ↗": { es: "Servicios de Salud ↗", fa: "خدمات بهداشتی ↗" },
    "Contact / Welcome ↗": { es: "Contacto / Bienvenida ↗", fa: "تماس / خوش‌آمدگویی ↗" },
    "A proud school of Memphis-Shelby County Schools.": { es: "Una escuela con orgullo de Memphis-Shelby County Schools.", fa: "مدرسه‌ای افتخارآمیز از مدارس منطقه ممفیس-شلبی." },
    "Phone:": { es: "Teléfono:", fa: "تلفن:" },
    "Greatness Grows Here. 🌟": { es: "Aquí Crece la Grandeza. 🌟", fa: "بزرگی اینجا رشد می‌کند. 🌟" },

    // ---------- Page heroes / breadcrumbs ----------
    "Welcome to": { es: "Bienvenidos a", fa: "به ما خوش آمدید" },
    "A welcoming Pre-K through 5th grade community in Memphis where every child is encouraged to grow. Our motto says it best —": {
      es: "Una comunidad acogedora de Pre-K a 5º grado en Memphis donde se anima a cada niño a crecer. Nuestro lema lo dice mejor —",
      fa: "یک جامعهٔ پذیرا از پیش‌دبستانی تا کلاس پنجم در ممفیس که هر کودک به رشد تشویق می‌شود. شعار ما بهترین بیان است —" },
    "📅 What's Happening This Week": { es: "📅 Qué Está Pasando Esta Semana", fa: "📅 این هفته چه خبر است" },
    "What's Happening This Week": { es: "Qué Está Pasando Esta Semana", fa: "این هفته چه خبر است" },
    "Your one-stop rundown for the week of": { es: "Tu resumen completo para la semana del", fa: "خلاصهٔ کامل شما برای هفتهٔ" },
    ". Reminders, events, menus, and what to send to school.": { es: ". Recordatorios, eventos, menús y qué enviar a la escuela.", fa: ". یادآوری‌ها، رویدادها، منوها و آنچه باید به مدرسه فرستاد." },
    "School Calendar": { es: "Calendario Escolar", fa: "تقویم مدرسه" },
    "Holidays, half-days, and school events at a glance. For the official district calendar, visit the MSCS site.": {
      es: "Días festivos, medios días y eventos escolares de un vistazo. Para el calendario oficial del distrito, visite el sitio de MSCS.",
      fa: "تعطیلات، نیم‌روزها و رویدادهای مدرسه در یک نگاه. برای تقویم رسمی منطقه، به سایت MSCS مراجعه کنید." },
    "Weekly Class Newsletters": { es: "Boletines Semanales de Clase", fa: "خبرنامه‌های هفتگی کلاس" },
    "This week's learning, homework, and reminders — straight from your child's teacher. Pick a grade, then choose your teacher.": {
      es: "El aprendizaje, la tarea y los recordatorios de esta semana — directamente del maestro de su hijo. Elija un grado y luego su maestro.",
      fa: "یادگیری، تکالیف و یادآوری‌های این هفته — مستقیم از معلم فرزند شما. یک پایه را انتخاب کنید، سپس معلم خود را انتخاب کنید." },
    "Meet Our Staff": { es: "Conozca a Nuestro Personal", fa: "با کارکنان ما آشنا شوید" },
    "The team behind": { es: "El equipo detrás de", fa: "تیم پشت" },
    "Search by name or filter by department to find contact information.": {
      es: "Busque por nombre o filtre por departamento para encontrar información de contacto.",
      fa: "بر اساس نام جستجو کنید یا بر اساس بخش فیلتر کنید تا اطلاعات تماس را بیابید." },
    "2025–2026 School Supply Lists": { es: "Listas de Útiles Escolares 2025–2026", fa: "فهرست لوازم مدرسه ۲۰۲۵–۲۰۲۶" },
    "Everything your child needs to start the year ready. Pick a grade below — please label personal items with your child's name.": {
      es: "Todo lo que su hijo necesita para empezar el año listo. Elija un grado abajo — por favor etiquete los artículos personales con el nombre de su hijo.",
      fa: "هر آنچه فرزند شما برای شروع آماده سال نیاز دارد. در زیر یک پایه را انتخاب کنید — لطفاً وسایل شخصی را با نام فرزندتان برچسب بزنید." },

    // ---------- Home ----------
    "Grades served": { es: "Grados atendidos", fa: "پایه‌های ارائه‌شده" },
    "School begins": { es: "Comienza la escuela", fa: "شروع مدرسه" },
    "Language program": { es: "Programa de idiomas", fa: "برنامهٔ زبان" },
    "Drop a photo of students / the school": { es: "Suelte una foto de los estudiantes / la escuela", fa: "یک عکس از دانش‌آموزان / مدرسه رها کنید" },
    "Greatness Grows Here": { es: "Aquí Crece la Grandeza", fa: "بزرگی اینجا رشد می‌کند" },
    "Memphis-Shelby County Schools": { es: "Escuelas del Condado de Memphis-Shelby", fa: "مدارس منطقهٔ ممفیس-شلبی" },
    "Grades & attendance": { es: "Calificaciones y asistencia", fa: "نمرات و حضور و غیاب" },
    "This month": { es: "Este mes", fa: "این ماه" },
    "Homework & news": { es: "Tarea y noticias", fa: "تکالیف و اخبار" },
    "By grade": { es: "Por grado", fa: "بر اساس پایه" },
    "Lunch Menus": { es: "Menús de Almuerzo", fa: "منوی ناهار" },
    "Breakfast & lunch": { es: "Desayuno y almuerzo", fa: "صبحانه و ناهار" },
    "Transportation": { es: "Transporte", fa: "حمل و نقل" },
    "Bus & routes": { es: "Autobús y rutas", fa: "اتوبوس و مسیرها" },
    "📌 At a glance": { es: "📌 De un vistazo", fa: "📌 در یک نگاه" },
    "This Week at Treadwell": { es: "Esta Semana en Treadwell", fa: "این هفته در ترِدول" },
    "The quick rundown for busy families — reminders, events, and what to send to school.": {
      es: "El resumen rápido para familias ocupadas — recordatorios, eventos y qué enviar a la escuela.",
      fa: "خلاصهٔ سریع برای خانواده‌های پرمشغله — یادآوری‌ها، رویدادها و آنچه باید به مدرسه فرستاد." },
    "See the full week →": { es: "Ver la semana completa →", fa: "مشاهدهٔ کل هفته →" },
    "Picture Day": { es: "Día de Fotos", fa: "روز عکس" },
    "Send order forms with your child": { es: "Envíe los formularios de pedido con su hijo", fa: "فرم‌های سفارش را همراه فرزندتان بفرستید" },
    "Early Dismissal · 11:30 AM": { es: "Salida Temprana · 11:30 AM", fa: "تعطیلی زودهنگام · ۱۱:۳۰ صبح" },
    "Professional development day": { es: "Día de desarrollo profesional", fa: "روز توسعهٔ حرفه‌ای" },
    "Spirit Day — Wear Red & Black": { es: "Día del Espíritu — Vista de Rojo y Negro", fa: "روز روحیه — قرمز و مشکی بپوشید" },
    "PTO popsicle social after school": { es: "Convivencia de paletas del PTO después de clases", fa: "مهمانی بستنی PTO بعد از مدرسه" },
    "A note from our principal": { es: "Una nota de nuestra directora", fa: "یادداشتی از مدیر ما" },
    "Every child, onward and upward.": { es: "Cada niño, adelante y hacia arriba.", fa: "هر کودک، رو به جلو و رو به بالا." },
    "Welcome to Treadwell Elementary! Our team is dedicated to a safe, joyful, and challenging learning environment where every student is known and supported. Whether your child is in Pre-K or finishing 5th grade, we partner with you to help them reach a little higher every day.": {
      es: "¡Bienvenidos a la Primaria Treadwell! Nuestro equipo se dedica a un ambiente de aprendizaje seguro, alegre y estimulante donde cada estudiante es conocido y apoyado. Ya sea que su hijo esté en Pre-K o terminando 5º grado, nos asociamos con usted para ayudarlo a llegar un poco más alto cada día.",
      fa: "به دبستان ترِدول خوش آمدید! تیم ما به محیط یادگیری امن، شاد و چالش‌برانگیز متعهد است که در آن هر دانش‌آموز شناخته و حمایت می‌شود. چه فرزند شما در پیش‌دبستانی باشد و چه کلاس پنجم را تمام کند، ما با شما همکاری می‌کنیم تا هر روز کمی بالاتر برود." },
    "Explore this site for weekly homework, supply lists, our staff directory, and the school calendar — and use the": {
      es: "Explore este sitio para la tarea semanal, las listas de útiles, el directorio del personal y el calendario escolar — y use el",
      fa: "این سایت را برای تکالیف هفتگی، فهرست لوازم، فهرست کارکنان و تقویم مدرسه کاوش کنید — و از دستیار" },
    "assistant in the corner anytime you have a quick question.": {
      es: "asistente en la esquina cuando tenga una pregunta rápida.",
      fa: "گوشهٔ صفحه هر زمان که سوال سریعی داشتید استفاده کنید." },
    "— The Treadwell Leadership Team": { es: "— El Equipo de Liderazgo de Treadwell", fa: "— تیم رهبری ترِدول" },
    "Principal's Office · (901) 416-6130": { es: "Oficina de la Directora · (901) 416-6130", fa: "دفتر مدیر · (901) 416-6130" },
    "Drop the principal's photo": { es: "Suelte la foto de la directora", fa: "عکس مدیر را رها کنید" },
    "News & Announcements": { es: "Noticias y Anuncios", fa: "اخبار و اطلاعیه‌ها" },
    "What's new at school": { es: "Qué hay de nuevo en la escuela", fa: "تازه‌های مدرسه" },
    "News photo": { es: "Foto de noticia", fa: "عکس خبر" },
    "Back-to-School Open House": { es: "Casa Abierta de Regreso a Clases", fa: "بازدید آغاز سال تحصیلی" },
    "Meet your child's teacher, drop off supplies, and tour the building before the first day. Doors open at 4:00 PM.": {
      es: "Conozca al maestro de su hijo, entregue los útiles y recorra el edificio antes del primer día. Las puertas abren a las 4:00 PM.",
      fa: "با معلم فرزندتان آشنا شوید، لوازم را تحویل دهید و قبل از روز اول از ساختمان بازدید کنید. درها ساعت ۴:۰۰ بعدازظهر باز می‌شوند." },
    "Read more →": { es: "Leer más →", fa: "بیشتر بخوانید →" },
    "Ongoing": { es: "En curso", fa: "در حال انجام" },
    "Dual Language Program": { es: "Programa de Lenguaje Dual", fa: "برنامهٔ دو زبانه" },
    "Treadwell's Dual Language pathway helps students grow as bilingual, biliterate learners. Learn how to enroll.": {
      es: "El programa de Lenguaje Dual de Treadwell ayuda a los estudiantes a crecer como aprendices bilingües y bialfabetizados. Aprenda cómo inscribirse.",
      fa: "مسیر دو زبانهٔ ترِدول به دانش‌آموزان کمک می‌کند تا به‌عنوان فراگیران دوزبانه رشد کنند. نحوهٔ ثبت‌نام را بیاموزید." },
    "District info →": { es: "Información del distrito →", fa: "اطلاعات منطقه →" },
    "Every Friday": { es: "Cada viernes", fa: "هر جمعه" },
    "Spirit Day & PTO Socials": { es: "Día del Espíritu y Convivencias del PTO", fa: "روز روحیه و مهمانی‌های PTO" },
    "Wear your red and black! Join the PTO after school for treats and a chance to connect with other families.": {
      es: "¡Vista de rojo y negro! Únase al PTO después de clases para disfrutar de golosinas y conectar con otras familias.",
      fa: "قرمز و مشکی بپوشید! بعد از مدرسه به PTO بپیوندید تا از خوراکی‌ها لذت ببرید و با خانواده‌های دیگر ارتباط برقرار کنید." },
    "See this week →": { es: "Ver esta semana →", fa: "این هفته را ببینید →" },
    "Upcoming Events": { es: "Próximos Eventos", fa: "رویدادهای پیش رو" },
    "Mark your calendar": { es: "Marque su calendario", fa: "تقویم خود را علامت بزنید" },
    "4th of July Holiday": { es: "Feriado del 4 de Julio", fa: "تعطیلی چهارم ژوئیه" },
    "School & offices closed": { es: "Escuela y oficinas cerradas", fa: "مدرسه و دفاتر تعطیل" },
    "First Day of School": { es: "Primer Día de Clases", fa: "اولین روز مدرسه" },
    "Full day · 8:15 AM – 3:15 PM": { es: "Día completo · 8:15 AM – 3:15 PM", fa: "روز کامل · ۸:۱۵ صبح – ۳:۱۵ بعدازظهر" },
    "Labor Day": { es: "Día del Trabajo", fa: "روز کارگر" },
    "No school": { es: "No hay clases", fa: "مدرسه تعطیل" },
    "Parent-Teacher Conferences": { es: "Conferencias de Padres y Maestros", fa: "جلسات والدین و معلمان" },
    "4:00 PM – 7:00 PM": { es: "4:00 PM – 7:00 PM", fa: "۴:۰۰ تا ۷:۰۰ بعدازظهر" },
    "View full calendar →": { es: "Ver calendario completo →", fa: "مشاهدهٔ تقویم کامل →" },
    "🦉 Need a quick answer?": { es: "🦉 ¿Necesita una respuesta rápida?", fa: "🦉 پاسخ سریع می‌خواهید؟" },
    "Ask Treadwell anything": { es: "Pregúntele a Treadwell lo que sea", fa: "هر چیزی از ترِدول بپرسید" },
    "Our virtual assistant answers common questions about school hours, homework, supply lists, and the calendar — and points you to the right district page for PowerSchool, busing, menus, and more.": {
      es: "Nuestro asistente virtual responde preguntas comunes sobre el horario escolar, la tarea, las listas de útiles y el calendario — y lo dirige a la página correcta del distrito para PowerSchool, transporte, menús y más.",
      fa: "دستیار مجازی ما به سوالات رایج دربارهٔ ساعات مدرسه، تکالیف، فهرست لوازم و تقویم پاسخ می‌دهد — و شما را به صفحهٔ درست منطقه برای پاوراسکول، سرویس، منو و موارد دیگر هدایت می‌کند." },
    "💬 Open the assistant": { es: "💬 Abrir el asistente", fa: "💬 باز کردن دستیار" },
    "Available any time in the bottom-right corner.": { es: "Disponible en cualquier momento en la esquina inferior derecha.", fa: "در هر زمان در گوشهٔ پایین سمت راست در دسترس است." },

    // ---------- This Week ----------
    "⏰ School hours 8:15 AM – 3:15 PM": { es: "⏰ Horario escolar 8:15 AM – 3:15 PM", fa: "⏰ ساعات مدرسه ۸:۱۵ صبح – ۳:۱۵ بعدازظهر" },
    "🚪 Doors open 7:45 AM": { es: "🚪 Puertas abren 7:45 AM", fa: "🚪 درها ساعت ۷:۴۵ صبح باز می‌شوند" },
    "🍳 Breakfast until 8:10 AM": { es: "🍳 Desayuno hasta las 8:10 AM", fa: "🍳 صبحانه تا ساعت ۸:۱۰ صبح" },
    "Monday": { es: "Lunes", fa: "دوشنبه" },
    "Tuesday": { es: "Martes", fa: "سه‌شنبه" },
    "Wednesday": { es: "Miércoles", fa: "چهارشنبه" },
    "Thursday": { es: "Jueves", fa: "پنجشنبه" },
    "Friday": { es: "Viernes", fa: "جمعه" },
    "Library books due": { es: "Devolución de libros de la biblioteca", fa: "مهلت بازگرداندن کتاب‌های کتابخانه" },
    "Grades 3–5": { es: "Grados 3–5", fa: "پایه‌های ۳ تا ۵" },
    "Reading Buddies": { es: "Compañeros de Lectura", fa: "همراهان مطالعه" },
    "K & 5th grade · 1:00 PM": { es: "Kínder y 5º grado · 1:00 PM", fa: "مهدکودک و پایهٔ پنجم · ۱:۰۰ بعدازظهر" },
    "Regular schedule": { es: "Horario regular", fa: "برنامهٔ عادی" },
    "No after-care": { es: "Sin cuidado después de clases", fa: "بدون مراقبت بعد از مدرسه" },
    "Plan pickup by 11:45 AM": { es: "Planee recoger antes de las 11:45 AM", fa: "برنامه‌ریزی برای بردن تا ۱۱:۴۵ صبح" },
    "STEM Day": { es: "Día STEM", fa: "روز STEM" },
    "Wear closed-toe shoes": { es: "Use zapatos cerrados", fa: "کفش سرپوشیده بپوشید" },
    "Spirit Day": { es: "Día del Espíritu", fa: "روز روحیه" },
    "Wear red & black!": { es: "¡Vista de rojo y negro!", fa: "قرمز و مشکی بپوشید!" },
    "PTO Popsicle Social": { es: "Convivencia de Paletas del PTO", fa: "مهمانی بستنی PTO" },
    "After school · front lawn": { es: "Después de clases · jardín del frente", fa: "بعد از مدرسه · چمن جلویی" },
    "Don't forget": { es: "No olvide", fa: "فراموش نکنید" },
    "What to send this week": { es: "Qué enviar esta semana", fa: "این هفته چه بفرستید" },
    "Picture Day order form (Monday) — checks payable to the photographer": { es: "Formulario de pedido del Día de Fotos (lunes) — cheques a nombre del fotógrafo", fa: "فرم سفارش روز عکس (دوشنبه) — چک به نام عکاس" },
    "Library books for grades 3–5 (Monday)": { es: "Libros de la biblioteca para grados 3–5 (lunes)", fa: "کتاب‌های کتابخانه برای پایه‌های ۳ تا ۵ (دوشنبه)" },
    "Water bottle, labeled with your child's name — every day": { es: "Botella de agua, etiquetada con el nombre de su hijo — todos los días", fa: "بطری آب با نام فرزندتان — هر روز" },
    "Closed-toe shoes for STEM Day (Thursday)": { es: "Zapatos cerrados para el Día STEM (jueves)", fa: "کفش سرپوشیده برای روز STEM (پنجشنبه)" },
    "Red & black spirit wear (Friday)": { es: "Ropa de espíritu roja y negra (viernes)", fa: "لباس روحیهٔ قرمز و مشکی (جمعه)" },
    "Signed Wednesday folder returned by Thursday": { es: "Carpeta del miércoles firmada y devuelta el jueves", fa: "پوشهٔ امضاشدهٔ چهارشنبه تا پنجشنبه بازگردانده شود" },
    "🍎 This week's lunch": { es: "🍎 El almuerzo de esta semana", fa: "🍎 ناهار این هفته" },
    "Cafeteria menu": { es: "Menú de la cafetería", fa: "منوی سلف سرویس" },
    "Full menu & allergens ↗": { es: "Menú completo y alérgenos ↗", fa: "منوی کامل و حساسیت‌زاها ↗" },
    "🌟 Student Spotlight": { es: "🌟 Estudiante Destacado", fa: "🌟 دانش‌آموز برگزیده" },
    "Owls of the Week": { es: "Búhos de la Semana", fa: "جغدهای هفته" },
    "Each week we celebrate students who show our school values — being kind, working hard, and going": {
      es: "Cada semana celebramos a los estudiantes que demuestran nuestros valores escolares — ser amables, trabajar duro e ir",
      fa: "هر هفته دانش‌آموزانی را که ارزش‌های مدرسهٔ ما را نشان می‌دهند جشن می‌گیریم — مهربان بودن، تلاش کردن و رفتن" },
    "Congratulations to this week's honorees from every grade level!": {
      es: "¡Felicidades a los homenajeados de esta semana de cada grado!",
      fa: "به برگزیدگان این هفته از همهٔ پایه‌ها تبریک می‌گوییم!" },
    "Teachers: submit your nominations through the staff portal by Thursday noon.": {
      es: "Maestros: envíen sus nominaciones a través del portal del personal antes del mediodía del jueves.",
      fa: "معلمان: نامزدهای خود را تا ظهر پنجشنبه از طریق پورتال کارکنان ارسال کنید." },
    "Drop a classroom / event photo": { es: "Suelte una foto del salón / evento", fa: "عکس کلاس / رویداد را رها کنید" },

    // ---------- Calendar ----------
    "Holiday / No school": { es: "Feriado / No hay clases", fa: "تعطیل / بدون مدرسه" },
    "Early dismissal": { es: "Salida temprana", fa: "تعطیلی زودهنگام" },
    "Event": { es: "Evento", fa: "رویداد" },
    "Spirit / PTO": { es: "Espíritu / PTO", fa: "روحیه / PTO" },
    "Sun": { es: "Dom", fa: "ی" },
    "Mon": { es: "Lun", fa: "د" },
    "Tue": { es: "Mar", fa: "س" },
    "Wed": { es: "Mié", fa: "چ" },
    "Thu": { es: "Jue", fa: "پ" },
    "Fri": { es: "Vie", fa: "ج" },
    "Sat": { es: "Sáb", fa: "ش" },
    "Official district calendar ↗": { es: "Calendario oficial del distrito ↗", fa: "تقویم رسمی منطقه ↗" },
    "Events this month": { es: "Eventos de este mes", fa: "رویدادهای این ماه" },
    "School event": { es: "Evento escolar", fa: "رویداد مدرسه" },

    // ---------- Newsletters ----------
    "🖨️ Print newsletter": { es: "🖨️ Imprimir boletín", fa: "🖨️ چاپ خبرنامه" },
    "View supply list →": { es: "Ver lista de útiles →", fa: "مشاهدهٔ فهرست لوازم →" },
    "Week of": { es: "Semana del", fa: "هفتهٔ" },
    "This Week We're Learning": { es: "Esta Semana Aprendemos", fa: "این هفته یاد می‌گیریم" },
    "Homework": { es: "Tarea", fa: "تکالیف" },
    "Day": { es: "Día", fa: "روز" },
    "Assignment": { es: "Tarea asignada", fa: "تکلیف" },
    "No new homework — read for fun & rest up! 🌟": { es: "Sin tarea nueva — ¡lean por diversión y descansen! 🌟", fa: "تکلیف جدیدی نیست — برای سرگرمی بخوانید و استراحت کنید! 🌟" },
    "Reminders": { es: "Recordatorios", fa: "یادآوری‌ها" },
    "Specials Schedule": { es: "Horario de Clases Especiales", fa: "برنامهٔ کلاس‌های ویژه" },
    "Questions? Email me:": { es: "¿Preguntas? Escríbame:", fa: "سوالی دارید؟ به من ایمیل بزنید:" },
    "Replies within 24 hours on school days.": { es: "Respuestas dentro de 24 horas en días escolares.", fa: "پاسخ ظرف ۲۴ ساعت در روزهای مدرسه." },

    // ---------- Directory ----------
    "📷 Photos are placeholders — drop in real staff portraits anytime. Emails follow the district format": {
      es: "📷 Las fotos son marcadores de posición — agregue retratos reales del personal en cualquier momento. Los correos siguen el formato del distrito",
      fa: "📷 عکس‌ها جای‌نگهدار هستند — هر زمان می‌توانید عکس واقعی کارکنان را اضافه کنید. ایمیل‌ها از قالب منطقه پیروی می‌کنند" },
    "(sample data shown).": { es: "(se muestran datos de ejemplo).", fa: "(داده‌های نمونه نشان داده شده است)." },
    "Search staff by name or role…": { es: "Buscar personal por nombre o función…", fa: "جستجوی کارکنان بر اساس نام یا سمت…" },
    "No staff match your search. Try a different name or department.": {
      es: "Ningún personal coincide con su búsqueda. Pruebe otro nombre o departamento.",
      fa: "هیچ کارمندی با جستجوی شما مطابقت ندارد. نام یا بخش دیگری را امتحان کنید." },
    "All": { es: "Todos", fa: "همه" },
    "Administration": { es: "Administración", fa: "مدیریت" },
    "Main Office": { es: "Oficina Principal", fa: "دفتر اصلی" },
    "Counseling & Behavioral": { es: "Consejería y Conducta", fa: "مشاوره و رفتار" },
    "Specialists": { es: "Especialistas", fa: "متخصصان" },
    "Dual Language": { es: "Lenguaje Dual", fa: "دو زبانه" },
    "Special Education & Support": { es: "Educación Especial y Apoyo", fa: "آموزش ویژه و پشتیبانی" },
    "ESL": { es: "ESL (Inglés como Segundo Idioma)", fa: "ESL (انگلیسی به‌عنوان زبان دوم)" },
    "Educational Assistants": { es: "Asistentes Educativos", fa: "دستیاران آموزشی" },
    "Pre-K": { es: "Pre-K", fa: "پیش‌دبستانی" },
    "Kindergarten": { es: "Kínder", fa: "مهدکودک" },
    "1st Grade": { es: "1.er Grado", fa: "پایهٔ اول" },
    "2nd Grade": { es: "2.º Grado", fa: "پایهٔ دوم" },
    "3rd Grade": { es: "3.er Grado", fa: "پایهٔ سوم" },
    "4th Grade": { es: "4.º Grado", fa: "پایهٔ چهارم" },
    "5th Grade": { es: "5.º Grado", fa: "پایهٔ پنجم" },

    // ---------- Supply ----------
    "🖨️ Print this list": { es: "🖨️ Imprimir esta lista", fa: "🖨️ چاپ این فهرست" },
    "Back to this week →": { es: "Volver a esta semana →", fa: "بازگشت به این هفته →" },

    // ---------- Nav / footer (new) ----------
    "About": { es: "Nosotros", fa: "درباره" },
    "About Treadwell": { es: "Sobre Treadwell", fa: "دربارهٔ ترِدول" },
    "Parents & Students": { es: "Padres y Estudiantes", fa: "والدین و دانش‌آموزان" },
    "Student Services": { es: "Servicios Estudiantiles", fa: "خدمات دانش‌آموزی" },
    "Services": { es: "Servicios", fa: "خدمات" },
    "Title I Content": { es: "Contenido de Título I", fa: "محتوای عنوان یک" },
    "Principal · Treadwell Elementary · (901) 416-6130": { es: "Director · Primaria Treadwell · (901) 416-6130", fa: "مدیر · دبستان ترِدول · (901) 416-6130" },

    // ---------- Parents & Students hub ----------
    "Your hub for the programs, services, and resources that support every Treadwell learner — from Dual Language to Title I, supply lists, the library, and student wellness.": {
      es: "Su centro para los programas, servicios y recursos que apoyan a cada estudiante de Treadwell — desde Lenguaje Dual hasta Título I, listas de útiles, la biblioteca y el bienestar estudiantil.",
      fa: "مرکز شما برای برنامه‌ها، خدمات و منابعی که از هر دانش‌آموز ترِدول حمایت می‌کنند — از دو زبانه تا عنوان یک، فهرست لوازم، کتابخانه و سلامت دانش‌آموز." },
    "Explore by topic": { es: "Explore por tema", fa: "بر اساس موضوع کاوش کنید" },
    "Everything families need, in one place": { es: "Todo lo que las familias necesitan, en un solo lugar", fa: "هر آنچه خانواده‌ها نیاز دارند، در یک مکان" },
    "Tap a topic to expand it. Each section links to the full details — and you can always ask the": {
      es: "Toque un tema para expandirlo. Cada sección enlaza a los detalles completos — y siempre puede preguntarle al",
      fa: "روی یک موضوع بزنید تا باز شود. هر بخش به جزئیات کامل پیوند دارد — و همیشه می‌توانید از" },
    "assistant for a quick answer.": { es: "asistente para una respuesta rápida.", fa: "دستیار برای پاسخ سریع بپرسید." },
    "West Tennessee's only K–5 Spanish-English immersion program": {
      es: "El único programa de inmersión español-inglés K–5 del oeste de Tennessee",
      fa: "تنها برنامهٔ غوطه‌وری اسپانیایی-انگلیسی K–۵ در غرب تنسی" },
    "ESL, C.L.U.E. gifted services, and district resources": {
      es: "ESL, servicios para dotados C.L.U.E. y recursos del distrito",
      fa: "ESL، خدمات استعدادهای درخشان C.L.U.E. و منابع منطقه" },
    "Family engagement, compacts, improvement plans & your rights": {
      es: "Participación familiar, compromisos, planes de mejora y sus derechos",
      fa: "مشارکت خانواده، توافق‌نامه‌ها، برنامه‌های بهبود و حقوق شما" },
    "Grade-by-grade lists to start the year ready": {
      es: "Listas por grado para comenzar el año listos",
      fa: "فهرست‌ها بر اساس پایه برای شروع آماده سال" },
    "Our media center, weekly checkout & reading at home": {
      es: "Nuestro centro de medios, préstamo semanal y lectura en casa",
      fa: "مرکز رسانه‌ای ما، امانت هفتگی و مطالعه در خانه" },
    "School nurse, immunizations & student well-being": {
      es: "Enfermera escolar, vacunas y bienestar estudiantil",
      fa: "پرستار مدرسه، واکسیناسیون و سلامت دانش‌آموز" },
    "Treadwell's 90/10 Dual Language Immersion Program helps students grow as bilingual, biliterate learners beginning in kindergarten. Learn about the model, why it works, and how to apply through the MSCS Optional Program.": {
      es: "El Programa de Inmersión de Lenguaje Dual 90/10 de Treadwell ayuda a los estudiantes a crecer como aprendices bilingües y bialfabetizados desde kínder. Conozca el modelo, por qué funciona y cómo aplicar a través del Programa Optional de MSCS.",
      fa: "برنامهٔ غوطه‌وری دو زبانهٔ ۹۰/۱۰ ترِدول به دانش‌آموزان کمک می‌کند از مهدکودک به‌عنوان فراگیران دوزبانه رشد کنند. دربارهٔ مدل، چرایی موفقیت آن و نحوهٔ ثبت‌نام از طریق برنامهٔ انتخابی MSCS بیاموزید." },
    "Dual Language program →": { es: "Programa de Lenguaje Dual →", fa: "برنامهٔ دو زبانه →" },
    "Apply at scsk12.org/optional ↗": { es: "Aplicar en scsk12.org/optional ↗", fa: "ثبت‌نام در scsk12.org/optional ↗" },
    "From English as a Second Language (ESL) support to C.L.U.E. gifted services, Treadwell connects every learner with the right help. Find program details and quick links to district family resources.": {
      es: "Desde el apoyo de Inglés como Segundo Idioma (ESL) hasta los servicios para dotados C.L.U.E., Treadwell conecta a cada estudiante con la ayuda adecuada. Encuentre detalles del programa y enlaces rápidos a los recursos familiares del distrito.",
      fa: "از پشتیبانی انگلیسی به‌عنوان زبان دوم (ESL) تا خدمات استعدادهای درخشان C.L.U.E.، ترِدول هر زبان‌آموز را با کمک مناسب پیوند می‌دهد. جزئیات برنامه و پیوندهای سریع به منابع خانوادهٔ منطقه را بیابید." },
    "Student services →": { es: "Servicios estudiantiles →", fa: "خدمات دانش‌آموزی →" },
    "District resources ↗": { es: "Recursos del distrito ↗", fa: "منابع منطقه ↗" },
    "As a schoolwide Title I school, Treadwell partners with families through our PLC, the School-Parent Compact, the School Improvement Plan, Parents' Right to Know, surveys, and more. See dates, documents, and how to get involved.": {
      es: "Como escuela de Título I de toda la escuela, Treadwell se asocia con las familias a través de nuestra PLC, el Compromiso Escuela-Padres, el Plan de Mejora Escolar, el Derecho de los Padres a Saber, encuestas y más. Vea fechas, documentos y cómo participar.",
      fa: "ترِدول به‌عنوان مدرسهٔ عنوان یک سراسری، از طریق PLC، توافق‌نامهٔ مدرسه-والدین، برنامهٔ بهبود مدرسه، حق دانستن والدین، نظرسنجی‌ها و موارد دیگر با خانواده‌ها همکاری می‌کند. تاریخ‌ها، اسناد و نحوهٔ مشارکت را ببینید." },
    "Title I content →": { es: "Contenido de Título I →", fa: "محتوای عنوان یک →" },
    "Family Engagement Plan →": { es: "Plan de Participación Familiar →", fa: "برنامهٔ مشارکت خانواده →" },
    "Find the 2025–2026 school supply list for your child's grade, Pre-K through 5th. Please label personal items with your child's name.": {
      es: "Encuentre la lista de útiles escolares 2025–2026 para el grado de su hijo, de Pre-K a 5º. Por favor etiquete los artículos personales con el nombre de su hijo.",
      fa: "فهرست لوازم مدرسهٔ ۲۰۲۵–۲۰۲۶ را برای پایهٔ فرزندتان، از پیش‌دبستانی تا پنجم، بیابید. لطفاً وسایل شخصی را با نام فرزندتان برچسب بزنید." },
    "Supply lists by grade →": { es: "Listas de útiles por grado →", fa: "فهرست لوازم بر اساس پایه →" },
    "The Treadwell library media center is the heart of our reading community. Students visit weekly to check out books, build research skills, and discover new favorites. Grades 3–5 books are due each Monday — please help your child keep them safe at home and return them on time.": {
      es: "El centro de medios de la biblioteca de Treadwell es el corazón de nuestra comunidad de lectura. Los estudiantes la visitan cada semana para sacar libros, desarrollar habilidades de investigación y descubrir nuevos favoritos. Los libros de los grados 3–5 se devuelven cada lunes — por favor ayude a su hijo a cuidarlos en casa y devolverlos a tiempo.",
      fa: "مرکز رسانه‌ای کتابخانهٔ ترِدول قلب جامعهٔ مطالعهٔ ماست. دانش‌آموزان هر هفته برای امانت گرفتن کتاب، تقویت مهارت‌های پژوهش و کشف کتاب‌های تازه به آن می‌روند. کتاب‌های پایه‌های ۳ تا ۵ هر دوشنبه باید بازگردانده شوند — لطفاً به فرزندتان کمک کنید آن‌ها را در خانه سالم نگه دارد و به‌موقع بازگرداند." },
    "Contact our Library Media specialist →": { es: "Contacte a nuestra especialista de Biblioteca →", fa: "با متخصص رسانهٔ کتابخانهٔ ما تماس بگیرید →" },
    "MSCS Libraries ↗": { es: "Bibliotecas de MSCS ↗", fa: "کتابخانه‌های MSCS ↗" },
    "Our school nurse supports students who feel unwell, manage medications, and meet Tennessee immunization requirements. Please keep your child's emergency contacts and health forms up to date through the front office, and reach out anytime with a health concern.": {
      es: "Nuestra enfermera escolar atiende a los estudiantes que se sienten mal, administra medicamentos y cumple con los requisitos de vacunación de Tennessee. Por favor mantenga actualizados los contactos de emergencia y los formularios de salud de su hijo a través de la oficina, y comuníquese en cualquier momento con una inquietud de salud.",
      fa: "پرستار مدرسهٔ ما از دانش‌آموزانی که حالشان خوب نیست مراقبت می‌کند، داروها را مدیریت می‌کند و الزامات واکسیناسیون تنسی را برآورده می‌سازد. لطفاً اطلاعات تماس اضطراری و فرم‌های سلامت فرزندتان را از طریق دفتر به‌روز نگه دارید و هر زمان نگرانی سلامتی داشتید تماس بگیرید." },
    "📞 Call the school nurse": { es: "📞 Llamar a la enfermera escolar", fa: "📞 تماس با پرستار مدرسه" },
    "District Health Services ↗": { es: "Servicios de Salud del Distrito ↗", fa: "خدمات بهداشتی منطقه ↗" },

    // ---------- Services page ----------
    "Treadwell connects every learner with the right support — English language services, gifted and talented enrichment, and a wealth of district family resources.": {
      es: "Treadwell conecta a cada estudiante con el apoyo adecuado — servicios de idioma inglés, enriquecimiento para dotados y talentosos, y una gran cantidad de recursos familiares del distrito.",
      fa: "ترِدول هر زبان‌آموز را با پشتیبانی مناسب پیوند می‌دهد — خدمات زبان انگلیسی، غنی‌سازی استعدادهای درخشان و انبوهی از منابع خانوادهٔ منطقه." },
    "English as a Second Language": { es: "Inglés como Segundo Idioma", fa: "انگلیسی به‌عنوان زبان دوم" },
    "ESL services for our multilingual learners": { es: "Servicios de ESL para nuestros estudiantes multilingües", fa: "خدمات ESL برای زبان‌آموزان چندزبانهٔ ما" },
    "Treadwell welcomes families from around the world. Our ESL program supports students whose first language is not English, helping them build the listening, speaking, reading, and writing skills they need to thrive across every subject.": {
      es: "Treadwell da la bienvenida a familias de todo el mundo. Nuestro programa de ESL apoya a los estudiantes cuyo primer idioma no es el inglés, ayudándoles a desarrollar las habilidades de escuchar, hablar, leer y escribir que necesitan para prosperar en cada materia.",
      fa: "ترِدول از خانواده‌های سراسر جهان استقبال می‌کند. برنامهٔ ESL ما از دانش‌آموزانی که زبان اولشان انگلیسی نیست حمایت می‌کند و به آن‌ها کمک می‌کند مهارت‌های شنیدن، صحبت کردن، خواندن و نوشتن لازم برای موفقیت در هر درس را بسازند." },
    "Certified ESL teachers work alongside classroom teachers — through small groups and in-class support — so students grow their English while staying fully part of grade-level learning. Families receive translated communication and interpretation support for conferences and meetings whenever needed.": {
      es: "Los maestros de ESL certificados trabajan junto a los maestros de aula — mediante grupos pequeños y apoyo en clase — para que los estudiantes desarrollen su inglés sin dejar de ser parte plena del aprendizaje de su grado. Las familias reciben comunicación traducida y apoyo de interpretación para conferencias y reuniones cuando lo necesiten.",
      fa: "معلمان مجاز ESL در کنار معلمان کلاس — از طریق گروه‌های کوچک و پشتیبانی درون‌کلاسی — کار می‌کنند تا دانش‌آموزان انگلیسی خود را تقویت کنند و در عین حال کاملاً بخشی از یادگیری پایه باشند. خانواده‌ها در صورت نیاز ارتباط ترجمه‌شده و پشتیبانی مترجم برای جلسات دریافت می‌کنند." },
    "Small-group support": { es: "Apoyo en grupos pequeños", fa: "پشتیبانی گروه کوچک" },
    "In-class co-teaching": { es: "Co-enseñanza en clase", fa: "تدریس مشترک در کلاس" },
    "Translated communication": { es: "Comunicación traducida", fa: "ارتباط ترجمه‌شده" },
    "Interpreter access": { es: "Acceso a intérpretes", fa: "دسترسی به مترجم" },
    "🧠 Gifted & Talented": { es: "🧠 Dotados y Talentosos", fa: "🧠 بااستعداد و سرآمد" },
    "C.L.U.E. — Creative Learning in a Unique Environment": { es: "C.L.U.E. — Aprendizaje Creativo en un Entorno Único", fa: "C.L.U.E. — یادگیری خلاق در محیطی منحصربه‌فرد" },
    "C.L.U.E. is the Memphis-Shelby County Schools program for academically gifted students. Through enrichment and project-based challenges, C.L.U.E. stretches curious thinkers beyond the standard curriculum. Students are identified through a district screening and referral process — ask your child's teacher or our office how to begin a referral.": {
      es: "C.L.U.E. es el programa de Memphis-Shelby County Schools para estudiantes académicamente dotados. A través del enriquecimiento y los retos basados en proyectos, C.L.U.E. desafía a los pensadores curiosos más allá del currículo estándar. Los estudiantes se identifican mediante un proceso de evaluación y remisión del distrito — pregunte al maestro de su hijo o a nuestra oficina cómo iniciar una remisión.",
      fa: "C.L.U.E. برنامهٔ مدارس منطقهٔ ممفیس-شلبی برای دانش‌آموزان بااستعداد تحصیلی است. از طریق غنی‌سازی و چالش‌های پروژه‌محور، C.L.U.E. متفکران کنجکاو را فراتر از برنامهٔ درسی استاندارد می‌برد. دانش‌آموزان از طریق فرآیند غربالگری و ارجاع منطقه شناسایی می‌شوند — از معلم فرزندتان یا دفتر ما بپرسید چگونه ارجاع را آغاز کنید." },
    "Learn about C.L.U.E. at MSCS ↗": { es: "Conozca C.L.U.E. en MSCS ↗", fa: "دربارهٔ C.L.U.E. در MSCS بیاموزید ↗" },
    "District Resources": { es: "Recursos del Distrito", fa: "منابع منطقه" },
    "Helpful links for families": { es: "Enlaces útiles para las familias", fa: "پیوندهای مفید برای خانواده‌ها" },
    "Quick connections to the Memphis-Shelby County Schools services families use most.": {
      es: "Conexiones rápidas a los servicios de Memphis-Shelby County Schools que las familias más usan.",
      fa: "دسترسی سریع به خدمات مدارس منطقهٔ ممفیس-شلبی که خانواده‌ها بیشتر استفاده می‌کنند." },
    "Check grades and attendance for your student.": { es: "Consulte calificaciones y asistencia de su estudiante.", fa: "نمرات و حضور و غیاب دانش‌آموزتان را بررسی کنید." },
    "Open PowerSchool ↗": { es: "Abrir PowerSchool ↗", fa: "باز کردن پاوراسکول ↗" },
    "Registration": { es: "Inscripción", fa: "ثبت‌نام" },
    "Enroll a new student or update records.": { es: "Inscriba a un nuevo estudiante o actualice registros.", fa: "دانش‌آموز جدید ثبت‌نام کنید یا سوابق را به‌روز کنید." },
    "Register ↗": { es: "Inscribirse ↗", fa: "ثبت‌نام ↗" },
    "Bus eligibility and route information.": { es: "Elegibilidad de autobús e información de rutas.", fa: "واجد شرایط بودن اتوبوس و اطلاعات مسیر." },
    "View routes ↗": { es: "Ver rutas ↗", fa: "مشاهدهٔ مسیرها ↗" },
    "Nutrition Services": { es: "Servicios de Nutrición", fa: "خدمات تغذیه" },
    "Breakfast and lunch menus and allergens.": { es: "Menús de desayuno y almuerzo y alérgenos.", fa: "منوی صبحانه و ناهار و حساسیت‌زاها." },
    "See menus ↗": { es: "Ver menús ↗", fa: "مشاهدهٔ منوها ↗" },
    "Health Services": { es: "Servicios de Salud", fa: "خدمات بهداشتی" },
    "School health, immunizations, and wellness.": { es: "Salud escolar, vacunas y bienestar.", fa: "سلامت مدرسه، واکسیناسیون و تندرستی." },
    "Health info ↗": { es: "Información de salud ↗", fa: "اطلاعات سلامت ↗" },
    "Students & Parents": { es: "Estudiantes y Padres", fa: "دانش‌آموزان و والدین" },
    "The full MSCS family resource center.": { es: "El centro completo de recursos familiares de MSCS.", fa: "مرکز کامل منابع خانوادهٔ MSCS." },
    "Explore ↗": { es: "Explorar ↗", fa: "کاوش ↗" },

    // ---------- Title I page ----------
    "Treadwell International Community School is a schoolwide Title I school. We partner with families through our Professional Learning Community (PLC) to raise achievement for every student.": {
      es: "Treadwell International Community School es una escuela de Título I de toda la escuela. Nos asociamos con las familias a través de nuestra Comunidad de Aprendizaje Profesional (PLC) para elevar el rendimiento de cada estudiante.",
      fa: "مدرسهٔ جامعهٔ بین‌المللی ترِدول یک مدرسهٔ عنوان یک سراسری است. ما از طریق جامعهٔ یادگیری حرفه‌ای (PLC) خود با خانواده‌ها همکاری می‌کنیم تا پیشرفت هر دانش‌آموز را افزایش دهیم." },
    "Title I school": { es: "escuela de Título I", fa: "مدرسهٔ عنوان یک" },
    ", Treadwell International Community School receives federal funding to strengthen teaching and learning — and the law guarantees families a voice in how that happens.": {
      es: ", Treadwell International Community School recibe fondos federales para fortalecer la enseñanza y el aprendizaje — y la ley garantiza a las familias una voz en cómo sucede.",
      fa: "، مدرسهٔ جامعهٔ بین‌المللی ترِدول بودجهٔ فدرال دریافت می‌کند تا آموزش و یادگیری را تقویت کند — و قانون به خانواده‌ها تضمین می‌دهد که در چگونگی آن نقش داشته باشند." },
    "Your involvement matters.": { es: "Su participación importa.", fa: "مشارکت شما اهمیت دارد." },
    "Below you'll find our annual meeting, key documents, and the people who can help you get connected.": {
      es: "A continuación encontrará nuestra reunión anual, documentos clave y las personas que pueden ayudarle a conectarse.",
      fa: "در زیر جلسهٔ سالانه، اسناد کلیدی و افرادی که می‌توانند به شما در ارتباط کمک کنند را خواهید یافت." },
    "📣 You're invited": { es: "📣 Está invitado", fa: "📣 شما دعوت هستید" },
    "Annual Title I Meeting": { es: "Reunión Anual de Título I", fa: "جلسهٔ سالانهٔ عنوان یک" },
    "August 19, 2025": { es: "19 de agosto de 2025", fa: "۱۹ اوت ۲۰۲۵" },
    "Learn about Title I program requirements, the school's participation, and your rights as a parent. Two sessions are offered for your convenience — attend whichever fits your day.": {
      es: "Conozca los requisitos del programa de Título I, la participación de la escuela y sus derechos como padre. Se ofrecen dos sesiones para su conveniencia — asista a la que mejor se ajuste a su día.",
      fa: "دربارهٔ الزامات برنامهٔ عنوان یک، مشارکت مدرسه و حقوق خود به‌عنوان والد بیاموزید. دو جلسه برای راحتی شما ارائه می‌شود — در هرکدام که با برنامهٔ روزتان مناسب است شرکت کنید." },
    "Morning session": { es: "Sesión de la mañana", fa: "جلسهٔ صبح" },
    "Afternoon session": { es: "Sesión de la tarde", fa: "جلسهٔ بعدازظهر" },
    "PLC Coach": { es: "Entrenadora de PLC", fa: "مربی PLC" },
    "Have questions about Title I, family engagement, or how to get involved? Our PLC Coach is here to help connect you with the right resources.": {
      es: "¿Tiene preguntas sobre el Título I, la participación familiar o cómo involucrarse? Nuestra Entrenadora de PLC está aquí para ayudarle a conectarse con los recursos adecuados.",
      fa: "دربارهٔ عنوان یک، مشارکت خانواده یا نحوهٔ مشارکت سوال دارید؟ مربی PLC ما اینجاست تا شما را با منابع مناسب پیوند دهد." },
    "Documents & Information": { es: "Documentos e Información", fa: "اسناد و اطلاعات" },
    "Title I resources for families": { es: "Recursos de Título I para las familias", fa: "منابع عنوان یک برای خانواده‌ها" },
    "Everything from our family engagement plan to your right to know about teacher qualifications.": {
      es: "Todo, desde nuestro plan de participación familiar hasta su derecho a conocer las cualificaciones de los maestros.",
      fa: "همه چیز از برنامهٔ مشارکت خانواده تا حق شما برای دانستن صلاحیت معلمان." },
    "Family Engagement Plan": { es: "Plan de Participación Familiar", fa: "برنامهٔ مشارکت خانواده" },
    "Jointly developed with parents to set expectations for involvement and partnership at Treadwell.": {
      es: "Desarrollado conjuntamente con los padres para establecer las expectativas de participación y colaboración en Treadwell.",
      fa: "با مشارکت والدین تدوین شده تا انتظارات مشارکت و همکاری در ترِدول را تعیین کند." },
    "Read the plan →": { es: "Leer el plan →", fa: "خواندن برنامه →" },
    "School-Parent Compact": { es: "Compromiso Escuela-Padres", fa: "توافق‌نامهٔ مدرسه-والدین" },
    "How students, families, teachers, and the principal share responsibility for student achievement.": {
      es: "Cómo los estudiantes, las familias, los maestros y el director comparten la responsabilidad del rendimiento estudiantil.",
      fa: "چگونه دانش‌آموزان، خانواده‌ها، معلمان و مدیر مسئولیت پیشرفت دانش‌آموز را به اشتراک می‌گذارند." },
    "Available at the front office & annual meeting": { es: "Disponible en la oficina principal y la reunión anual", fa: "در دفتر اصلی و جلسهٔ سالانه در دسترس است" },
    "School Improvement Plan": { es: "Plan de Mejora Escolar", fa: "برنامهٔ بهبود مدرسه" },
    "Our schoolwide plan and goals for raising achievement, reviewed with families each year.": {
      es: "Nuestro plan y metas de toda la escuela para elevar el rendimiento, revisado con las familias cada año.",
      fa: "برنامه و اهداف سراسری ما برای افزایش پیشرفت، که هر سال با خانواده‌ها بررسی می‌شود." },
    "Reviewed at the annual meeting": { es: "Revisado en la reunión anual", fa: "در جلسهٔ سالانه بررسی می‌شود" },
    "Parents' Right to Know": { es: "Derecho de los Padres a Saber", fa: "حق دانستن والدین" },
    "Your right to request the professional qualifications of your child's teachers and paraprofessionals.": {
      es: "Su derecho a solicitar las cualificaciones profesionales de los maestros y paraprofesionales de su hijo.",
      fa: "حق شما برای درخواست صلاحیت‌های حرفه‌ای معلمان و دستیاران فرزندتان." },
    "Request through the main office": { es: "Solicite a través de la oficina principal", fa: "از طریق دفتر اصلی درخواست دهید" },
    "Surveys": { es: "Encuestas", fa: "نظرسنجی‌ها" },
    "Family surveys shape our parent meetings, workshops, and improvement priorities. Your feedback counts.": {
      es: "Las encuestas familiares dan forma a nuestras reuniones de padres, talleres y prioridades de mejora. Su opinión cuenta.",
      fa: "نظرسنجی‌های خانواده به جلسات والدین، کارگاه‌ها و اولویت‌های بهبود ما شکل می‌دهد. بازخورد شما مهم است." },
    "Watch for our annual survey": { es: "Esté atento a nuestra encuesta anual", fa: "منتظر نظرسنجی سالانهٔ ما باشید" },
    "CSI Parent Letter": { es: "Carta CSI para Padres", fa: "نامهٔ CSI برای والدین" },
    "Comprehensive Support & Improvement notice for families, explaining our status and support plan.": {
      es: "Aviso de Apoyo y Mejora Integral para las familias, que explica nuestro estado y plan de apoyo.",
      fa: "اطلاعیهٔ پشتیبانی و بهبود جامع برای خانواده‌ها، که وضعیت و برنامهٔ پشتیبانی ما را توضیح می‌دهد." },
    "Distributed to all families": { es: "Distribuida a todas las familias", fa: "بین همهٔ خانواده‌ها توزیع می‌شود" },

    // ---------- About Us page ----------
    "A welcoming Pre-K–5 international community school in Memphis where every child is known, challenged, and encouraged to grow — Onward and Upward.": {
      es: "Una acogedora escuela comunitaria internacional de Pre-K a 5º en Memphis donde cada niño es conocido, desafiado y animado a crecer — Adelante y Hacia Arriba.",
      fa: "یک مدرسهٔ جامعهٔ بین‌المللی پذیرا از پیش‌دبستانی تا پنجم در ممفیس که هر کودک شناخته، به چالش کشیده و به رشد تشویق می‌شود — رو به جلو و رو به بالا." },
    "Mission & Philosophy": { es: "Misión y Filosofía", fa: "مأموریت و فلسفه" },
    "We educate the whole child in a safe, joyful, and academically challenging environment — preparing bilingual, globally-minded learners to go": {
      es: "Educamos al niño en su totalidad en un ambiente seguro, alegre y académicamente desafiante — preparando a aprendices bilingües y de mentalidad global para ir",
      fa: "ما کل کودک را در محیطی امن، شاد و چالش‌برانگیز از نظر تحصیلی آموزش می‌دهیم — و فراگیران دوزبانه و جهان‌نگر را آماده می‌کنیم تا" },
    "Our Mission": { es: "Nuestra Misión", fa: "مأموریت ما" },
    "Every child, known and challenged": { es: "Cada niño, conocido y desafiado", fa: "هر کودک، شناخته‌شده و به‌چالش‌کشیده" },
    "Treadwell International Community School partners with families to give every student a safe and joyful place to learn. As home to West Tennessee's only K–5 Spanish-English Dual Language Immersion Program, we celebrate the languages and cultures our families bring — and hold high expectations for what each child can achieve.": {
      es: "Treadwell International Community School se asocia con las familias para dar a cada estudiante un lugar seguro y alegre para aprender. Como hogar del único Programa de Inmersión de Lenguaje Dual español-inglés K–5 del oeste de Tennessee, celebramos los idiomas y las culturas que nuestras familias aportan — y mantenemos altas expectativas de lo que cada niño puede lograr.",
      fa: "مدرسهٔ جامعهٔ بین‌المللی ترِدول با خانواده‌ها همکاری می‌کند تا به هر دانش‌آموز مکانی امن و شاد برای یادگیری بدهد. به‌عنوان خانهٔ تنها برنامهٔ غوطه‌وری دو زبانهٔ اسپانیایی-انگلیسی K–۵ در غرب تنسی، زبان‌ها و فرهنگ‌هایی را که خانواده‌های ما به ارمغان می‌آورند جشن می‌گیریم — و انتظارات بالایی برای آنچه هر کودک می‌تواند به دست آورد داریم." },
    "From Pre-K through 5th grade, our teachers know their students by name and meet them where they are, helping them reach a little higher every day.": {
      es: "Desde Pre-K hasta 5º grado, nuestros maestros conocen a sus estudiantes por su nombre y los encuentran donde están, ayudándoles a llegar un poco más alto cada día.",
      fa: "از پیش‌دبستانی تا پایهٔ پنجم، معلمان ما دانش‌آموزان خود را با نام می‌شناسند و آن‌ها را همان‌جا که هستند می‌پذیرند و کمک می‌کنند هر روز کمی بالاتر بروند." },
    "Learning together at Treadwell": { es: "Aprendiendo juntos en Treadwell", fa: "یادگیری در کنار هم در ترِدول" },
    "What We Believe": { es: "Lo Que Creemos", fa: "آنچه باور داریم" },
    "Our philosophy": { es: "Nuestra filosofía", fa: "فلسفهٔ ما" },
    "All children can learn": { es: "Todos los niños pueden aprender", fa: "همهٔ کودکان می‌توانند یاد بگیرند" },
    "We believe every student arrives with strengths, curiosity, and the capacity to grow. Our job is to build on those strengths with strong teaching, high expectations, and the support each child needs to succeed.": {
      es: "Creemos que cada estudiante llega con fortalezas, curiosidad y la capacidad de crecer. Nuestro trabajo es desarrollar esas fortalezas con una enseñanza sólida, altas expectativas y el apoyo que cada niño necesita para tener éxito.",
      fa: "ما باور داریم هر دانش‌آموز با توانمندی‌ها، کنجکاوی و ظرفیت رشد می‌آید. وظیفهٔ ما ساختن بر پایهٔ این توانمندی‌ها با تدریس قوی، انتظارات بالا و پشتیبانی لازم برای موفقیت هر کودک است." },
    "Family & community are partners": { es: "La familia y la comunidad son socios", fa: "خانواده و جامعه شریک‌اند" },
    "Learning thrives when school and home work together. We welcome families as active partners — through communication, engagement, and a shared commitment to each child's success.": {
      es: "El aprendizaje prospera cuando la escuela y el hogar trabajan juntos. Damos la bienvenida a las familias como socios activos — mediante la comunicación, la participación y un compromiso compartido con el éxito de cada niño.",
      fa: "یادگیری زمانی شکوفا می‌شود که مدرسه و خانه با هم کار کنند. ما از خانواده‌ها به‌عنوان شریکان فعال استقبال می‌کنیم — از طریق ارتباط، مشارکت و تعهد مشترک به موفقیت هر کودک." },
    "Two languages, one community": { es: "Dos idiomas, una comunidad", fa: "دو زبان، یک جامعه" },
    "Bilingualism and biliteracy open doors. Through Dual Language and a globally-minded culture, students grow as confident communicators who value many perspectives.": {
      es: "El bilingüismo y la bialfabetización abren puertas. A través del Lenguaje Dual y una cultura de mentalidad global, los estudiantes crecen como comunicadores seguros que valoran muchas perspectivas.",
      fa: "دوزبانگی و دوسوادی درها را می‌گشاید. از طریق برنامهٔ دو زبانه و فرهنگی جهان‌نگر، دانش‌آموزان به‌عنوان ارتباط‌گیرندگانی مطمئن رشد می‌کنند که دیدگاه‌های گوناگون را ارج می‌نهند." },
    "A safe, joyful place to grow": { es: "Un lugar seguro y alegre para crecer", fa: "مکانی امن و شاد برای رشد" },
    "Children learn best when they feel safe, seen, and celebrated. We nurture character, kindness, and a love of learning alongside academic achievement.": {
      es: "Los niños aprenden mejor cuando se sienten seguros, vistos y celebrados. Cultivamos el carácter, la amabilidad y el amor por el aprendizaje junto con el logro académico.",
      fa: "کودکان زمانی بهتر یاد می‌گیرند که احساس امنیت، دیده‌شدن و ارزشمندی کنند. ما شخصیت، مهربانی و عشق به یادگیری را در کنار پیشرفت تحصیلی پرورش می‌دهیم." },
    "Onward & Upward": { es: "Adelante y Hacia Arriba", fa: "رو به جلو و رو به بالا" }, // (also used as About value card)
    "Our motto is a promise — to help every student reach a little higher each day.": {
      es: "Nuestro lema es una promesa — ayudar a cada estudiante a llegar un poco más alto cada día.",
      fa: "شعار ما یک وعده است — کمک به هر دانش‌آموز تا هر روز کمی بالاتر برود." },
    "Globally Minded": { es: "Mentalidad Global", fa: "جهان‌نگر" },
    "An international community where many languages, cultures, and stories are valued.": {
      es: "Una comunidad internacional donde se valoran muchos idiomas, culturas e historias.",
      fa: "جامعه‌ای بین‌المللی که در آن زبان‌ها، فرهنگ‌ها و داستان‌های بسیار ارج نهاده می‌شوند." },
    "Stronger Together": { es: "Más Fuertes Juntos", fa: "قوی‌تر در کنار هم" },
    "Families, staff, and the wider community working side by side for our students.": {
      es: "Familias, personal y la comunidad en general trabajando lado a lado por nuestros estudiantes.",
      fa: "خانواده‌ها، کارکنان و جامعهٔ گسترده‌تر در کنار هم برای دانش‌آموزان ما کار می‌کنند." },
    "🤝 Get Involved": { es: "🤝 Participe", fa: "🤝 مشارکت کنید" },
    "Become a Volunteer or School Adopter": { es: "Conviértase en Voluntario o Patrocinador Escolar", fa: "داوطلب یا حامی مدرسه شوید" },
    "Treadwell grows stronger with you. Whether you can give an hour reading with students or your organization wants to adopt our school, Memphis-Shelby County Schools' Family & Community Engagement (FACE) team makes it easy to get started.": {
      es: "Treadwell se fortalece con usted. Ya sea que pueda dar una hora leyendo con los estudiantes o que su organización quiera patrocinar nuestra escuela, el equipo de Participación Familiar y Comunitaria (FACE) de Memphis-Shelby County Schools facilita comenzar.",
      fa: "ترِدول با شما قوی‌تر می‌شود. چه بتوانید یک ساعت با دانش‌آموزان مطالعه کنید و چه سازمان شما بخواهد مدرسهٔ ما را حمایت کند، تیم مشارکت خانواده و جامعهٔ (FACE) مدارس منطقهٔ ممفیس-شلبی آغاز کار را آسان می‌کند." },
    "Get started at scsk12.org/face25 ↗": { es: "Comience en scsk12.org/face25 ↗", fa: "شروع کنید در scsk12.org/face25 ↗" },
    "Volunteer": { es: "Voluntario", fa: "داوطلب" },
    "Read with students, support teachers, or lend a special talent.": {
      es: "Lea con los estudiantes, apoye a los maestros o aporte un talento especial.",
      fa: "با دانش‌آموزان مطالعه کنید، از معلمان حمایت کنید یا استعداد ویژه‌ای به اشتراک بگذارید." },
    "Adopt a School": { es: "Patrocinar una Escuela", fa: "حمایت از یک مدرسه" },
    "Businesses & groups can partner with Treadwell year-round.": {
      es: "Las empresas y los grupos pueden asociarse con Treadwell todo el año.",
      fa: "کسب‌وکارها و گروه‌ها می‌توانند در طول سال با ترِدول همکاری کنند." },
    "Mentor": { es: "Mentor", fa: "راهنما" },
    "Be a steady, caring presence for a young learner.": {
      es: "Sea una presencia constante y afectuosa para un joven estudiante.",
      fa: "حضوری پایدار و دلسوز برای یک فراگیر جوان باشید." },

    // ---------- Chatbot ----------
    "Ask Treadwell": { es: "Pregúntele a Treadwell", fa: "از ترِدول بپرسید" },
    "Quick answers for families": { es: "Respuestas rápidas para familias", fa: "پاسخ‌های سریع برای خانواده‌ها" },
    "Ask a question…": { es: "Haga una pregunta…", fa: "سوالی بپرسید…" },
    "Virtual assistant · For account & official info you'll be linked to the district site.": {
      es: "Asistente virtual · Para información de cuenta y oficial se le dirigirá al sitio del distrito.",
      fa: "دستیار مجازی · برای اطلاعات حساب و رسمی به سایت منطقه هدایت می‌شوید." },
    "Hi there! 👋 I'm the Treadwell assistant. Ask me about school hours, supply lists, homework, the calendar, or where to find things on the district site. How can I help?": {
      es: "¡Hola! 👋 Soy el asistente de Treadwell. Pregúnteme sobre el horario escolar, las listas de útiles, la tarea, el calendario o dónde encontrar cosas en el sitio del distrito. ¿Cómo puedo ayudar?",
      fa: "سلام! 👋 من دستیار ترِدول هستم. دربارهٔ ساعات مدرسه، فهرست لوازم، تکالیف، تقویم یا محل یافتن اطلاعات در سایت منطقه از من بپرسید. چطور می‌توانم کمک کنم؟" },
    "What time does school start?": { es: "¿A qué hora empieza la escuela?", fa: "مدرسه چه ساعتی شروع می‌شود؟" },
    "Where's my child's supply list?": { es: "¿Dónde está la lista de útiles de mi hijo?", fa: "فهرست لوازم فرزند من کجاست؟" },
    "How do I check grades?": { es: "¿Cómo reviso las calificaciones?", fa: "چطور نمرات را بررسی کنم؟" },
    "Bus & transportation": { es: "Autobús y transporte", fa: "اتوبوس و حمل و نقل" },
    "This week's lunch menu": { es: "Menú de almuerzo de esta semana", fa: "منوی ناهار این هفته" },
    "Report an absence": { es: "Reportar una ausencia", fa: "گزارش غیبت" },
  };

  const norm = (s) => s.replace(/\s+/g, " ").trim();
  function translate(en, lang) {
    if (lang === "en") return null;
    const hit = DICT[norm(en)];
    return hit && hit[lang] ? hit[lang] : null;
  }

  let current = localStorage.getItem("tw-lang") || "en";
  let applying = false;

  // ---- text-node walker ----
  function walk(root, lang) {
    const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(n) {
        if (!n.nodeValue || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        const p = n.parentNode;
        if (!p) return NodeFilter.FILTER_REJECT;
        const tag = p.nodeName;
        if (tag === "SCRIPT" || tag === "STYLE" || tag === "TEXTAREA") return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    const nodes = [];
    while (tw.nextNode()) nodes.push(tw.currentNode);
    nodes.forEach((n) => {
      if (n.__en === undefined) n.__en = n.nodeValue; // capture English baseline
      const base = n.__en;
      if (lang === "en") {
        if (n.nodeValue !== base) n.nodeValue = base;
        return;
      }
      const t = translate(base, lang);
      if (t !== null) {
        // preserve leading/trailing whitespace
        const lead = base.match(/^\s*/)[0];
        const trail = base.match(/\s*$/)[0];
        n.nodeValue = lead + t + trail;
      } else if (n.nodeValue !== base) {
        n.nodeValue = base;
      }
    });
    // placeholder attributes
    root.querySelectorAll("[placeholder]").forEach((el) => {
      if (el.__enPh === undefined) el.__enPh = el.getAttribute("placeholder");
      const base = el.__enPh;
      const t = lang === "en" ? base : translate(base, lang) || base;
      el.setAttribute("placeholder", t);
    });
  }

  function applyLang(lang) {
    current = lang;
    localStorage.setItem("tw-lang", lang);
    const meta = LANGS[lang] || LANGS.en;
    document.documentElement.lang = lang;
    document.documentElement.dir = meta.dir;
    if (lang === "fa") ensureFarsiFont();
    applying = true;
    walk(document.body, lang);
    applying = false;
    window.TW_LANG = lang;
    window.TW_LANG_NAME = meta.name;
    // refresh switcher active state
    document.querySelectorAll(".lang-btn").forEach((b) =>
      b.classList.toggle("active", b.dataset.lang === lang)
    );
  }

  let farsiLoaded = false;
  function ensureFarsiFont() {
    if (farsiLoaded) return;
    farsiLoaded = true;
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700&display=swap";
    document.head.appendChild(l);
  }

  // ---- RTL + font CSS ----
  const css = document.createElement("style");
  css.textContent = `
    .lang-switch{display:inline-flex;background:rgba(255,255,255,.12);border-radius:999px;padding:2px;gap:2px;}
    .lang-btn{background:transparent;border:0;color:#e8d9d9;font-family:inherit;font-weight:800;font-size:12.5px;
      padding:4px 11px;border-radius:999px;cursor:pointer;line-height:1.4;transition:background .13s,color .13s;}
    .lang-btn:hover{color:#fff;}
    .lang-btn.active{background:var(--gold);color:var(--navy);}
    html[lang=fa] body{font-family:'Vazirmatn',system-ui,sans-serif;}
    html[lang=fa] h1,html[lang=fa] h2,html[lang=fa] h3,html[lang=fa] h4,html[lang=fa] h5,
    html[lang=fa] .brand-text .name,html[lang=fa] .section-title,html[lang=fa] .eyebrow{font-family:'Vazirmatn',system-ui,sans-serif;}
    html[dir=rtl] .eyebrow,html[dir=rtl] .section-head p,html[dir=rtl] .lede{letter-spacing:0;}
    html[dir=rtl] .crumbs{flex-direction:row-reverse;}
    html[dir=rtl] .mainnav a.active::after{left:14px;right:14px;}
    html[dir=rtl] .cbot-msg.bot{border-bottom-left-radius:16px;border-bottom-right-radius:5px;}
    html[dir=rtl] .cbot-msg.me{border-bottom-right-radius:16px;border-bottom-left-radius:5px;}
    html[dir=rtl] .ev-info span,html[dir=rtl] .me-row .info span{direction:rtl;}
  `;
  document.head.appendChild(css);

  // ---- inject switcher into top bar ----
  function injectSwitcher() {
    const right = document.querySelector(".topbar .tb-right");
    if (!right || right.querySelector(".lang-switch")) return;
    const sw = document.createElement("div");
    sw.className = "lang-switch";
    sw.setAttribute("aria-label", "Language");
    Object.keys(LANGS).forEach((code) => {
      const b = document.createElement("button");
      b.className = "lang-btn" + (code === current ? " active" : "");
      b.dataset.lang = code;
      b.textContent = LANGS[code].label;
      b.title = LANGS[code].name;
      b.addEventListener("click", () => applyLang(code));
      sw.appendChild(b);
    });
    right.insertBefore(sw, right.firstChild);
  }

  // ---- observe dynamic content (chatbot, JS-rendered pages) ----
  const observer = new MutationObserver((muts) => {
    if (applying || current === "en") return;
    applying = true;
    muts.forEach((m) => {
      m.addedNodes.forEach((n) => {
        if (n.nodeType === 1) walk(n, current);
        else if (n.nodeType === 3 && n.parentNode) walk(n.parentNode, current);
      });
    });
    applying = false;
  });

  function init() {
    injectSwitcher();
    observer.observe(document.body, { childList: true, subtree: true });
    if (current !== "en") applyLang(current);
    else { window.TW_LANG = "en"; window.TW_LANG_NAME = "English"; }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
