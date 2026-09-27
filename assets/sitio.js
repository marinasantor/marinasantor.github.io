(function(){
  var b = document.querySelector('.hbg'), m = document.getElementById('movil');
  if(!b || !m) return;
  b.addEventListener('click', function(){
    var ab = m.getAttribute('data-open') === 'si';
    m.setAttribute('data-open', ab ? 'no' : 'si');
    b.setAttribute('aria-expanded', ab ? 'false' : 'true');
  });
  Array.prototype.forEach.call(m.querySelectorAll('a'), function(a){
    a.addEventListener('click', function(){
      m.setAttribute('data-open','no');
      b.setAttribute('aria-expanded','false');
    });
  });
})();

/* preguntas frecuentes */
Array.prototype.forEach.call(document.querySelectorAll('.faq__b'), function(b){
  b.addEventListener('click', function(){
    var r = document.getElementById(b.getAttribute('aria-controls'));
    var ab = b.getAttribute('aria-expanded') === 'true';
    b.setAttribute('aria-expanded', ab ? 'false' : 'true');
    r.setAttribute('data-open', ab ? 'no' : 'si');
  });
});

/* contador de caracteres */
Array.prototype.forEach.call(document.querySelectorAll('[data-contador]'), function(c){
  var s = document.getElementById(c.getAttribute('data-contador'));
  var tope = c.getAttribute('maxlength') || 800;
  var f = function(){ s.textContent = c.value.length + ' / ' + tope + ' caracteres'; };
  c.addEventListener('input', f); f();
});

/* captura de correo */
Array.prototype.forEach.call(document.querySelectorAll('[data-boletin]'), function(f){
  f.addEventListener('submit', function(e){
    e.preventDefault();
    var caja = f.parentNode.querySelector('.mensaje-ok');
    caja.textContent = 'Anotado. El envío automático todavía no está conectado: por ahora escribinos por WhatsApp y te mandamos el material.';
    caja.setAttribute('data-v','si');
  });
});

/* formulario de cita */
var fc = document.getElementById('form-cita');
if (fc) {
  fc.addEventListener('submit', function(e){
    e.preventDefault();
    var ok = document.getElementById('cita-ok');
    var er = document.getElementById('cita-error');
    var d = new FormData(fc);
    ok.setAttribute('data-v','no'); er.setAttribute('data-v','no');
    if (!(d.get('nombre')||'').trim() || !(d.get('email')||'').trim()) {
      er.textContent = 'Faltan completar el nombre y el correo electrónico.';
      er.setAttribute('data-v','si');
      er.scrollIntoView({behavior:'smooth', block:'center'});
      return;
    }
    ok.textContent = 'Recibimos tus datos. El envío automático todavía no está conectado, así que por ahora escribinos por WhatsApp para que no se pierda la consulta.';
    ok.setAttribute('data-v','si');
    ok.scrollIntoView({behavior:'smooth', block:'center'});
  });
}
