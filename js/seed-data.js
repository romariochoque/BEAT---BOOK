/* ==========================================================================
   BEET & BOOK - DATOS SEMILLA DE RESPALDO (SEED DATA)
   Garantiza que la aplicación funcione al 100% de manera inmediata,
   incluso si se abre localmente mediante file:// sin servidor web.
   ========================================================================== */

window.BEET_DEFAULT_DATA = {
  books: [
    {
      id: "book-1",
      title: "El Eco del Jazz",
      author: "Mateo S. Valdivia",
      price: 18.50,
      rating: 4.9,
      genre: "Ficción Musical",
      badge: "Más Leído",
      coverColor: "linear-gradient(135deg, #1e1b4b, #4338ca, #d97706)",
      coverIcon: "🎷",
      recommendedTrack: "Velvet Rain & Sax",
      description: "Una cautivadora historia ambientada en un club clandestino de Nueva Orleans en 1928, donde un pianista prodigio y una escritora bohemia entrelazan sus destinos al compás del nacimiento del jazz moderno.",
      pagesCount: 240,
      previewChapters: [
        {
          chapter: 1,
          title: "Capítulo I: Las teclas desgastadas del Blue Moon",
          content: "El humo de los cigarros de Virginia flotaba suspendido en el aire denso del sótano, como si la propia gravedad se negara a perturbar la quietud de las dos de la mañana. Leo apoyó los dedos temblorosos sobre las teclas marfileñas del viejo Steinway. El barniz estaba gastado en los registros centrales, testigo de incontables noches de síncopas desesperadas y aplausos furtivos.\n\nEn la tercera mesa junto al escenario, una mujer abría una libreta de piel encuadernada a mano. No levantó la mirada cuando el primer acorde en Mi bemol menor rasgó la penumbra, pero sus dedos dejaron de escribir de inmediato. Aquel acorde no estaba en ninguna partitura conocida; era el lamento íntimo de alguien que había perdido su ciudad natal y solo le quedaba el ritmo para no desvanecerse en el olvido."
        },
        {
          chapter: 2,
          title: "Capítulo II: La melodía que no se puede escribir",
          content: "—¿Por qué tocas como si cada compás fuera una despedida? —preguntó ella al filo del amanecer, cuando el Blue Moon apagaba sus bombillas de ámbar y las botellas vacías reposaban en la barra.\n\nLeo limpió una tecla con la manga de su chaleco. No la miró a los ojos, pero una leve sonrisa se dibujó en la comisura de sus labios.\n—Porque los libros fijan las palabras para siempre, Clara. La música, en cambio, desaparece en el mismo segundo en que nace. Si no tocas con todo el pecho, el viento se lleva la emoción antes de que llegue a tu copa.\n\nClara sonrió y deslizó un poema escrito en la servilleta de lino. 'Entonces toca para que este momento nunca termine'."
        },
        {
          chapter: 3,
          title: "Capítulo III: El secreto de la partitura oculta",
          content: "Entre los estantes de partituras carcomidas de la tienda de antigüedades de Royal Street, Leo descubrió un manuscrito sin firma, cosido con hilo dorado. No tenía notas convencionales; en su lugar, contenía descripciones de olores, colores y suspiros:\n\n'Compás 12: tocar con el timbre del primer frío de noviembre en el puerto.'\n\nComprendió entonces que existía un lenguaje intermedio donde la literatura y el sonido convergían en una única respiración humana."
        }
      ]
    },
    {
      id: "book-2",
      title: "La Melodía de Medianoche",
      author: "Clara Benavides",
      price: 16.90,
      rating: 4.8,
      genre: "Misterio",
      badge: "Novedad",
      coverColor: "linear-gradient(135deg, #09090b, #18181b, #3b82f6)",
      coverIcon: "🎻",
      recommendedTrack: "Midnight Lo-Fi Coffee",
      description: "En una librería-disquería vintage del Soho londinense, un misterioso vinilo sin etiquetar empieza a reproducir susurros con pistas sobre la desaparición de un afamado compositor ocurrida 30 años atrás.",
      pagesCount: 310,
      previewChapters: [
        {
          chapter: 1,
          title: "Capítulo I: El vinilo sin surco final",
          content: "La aguja de diamante del tocadiscos Thorens bajó con una suavidad quirúrgica. Julian contuvo la respiración. El disco de acetato de 10 pulgadas no tenía sello discográfico ni número de serie; solo una inscripción grabada con aguja fina en el centro: 'Para quien sepa leer entre compases'.\n\nUn crujido cálido llenó la tienda, seguido por cuatro acordes lentos de contrabajo. Pero lo que vino a continuación heló su sangre: una voz femenina recitaba en susurros la dirección exacta de su propia librería, seguida de una fecha: esta misma noche."
        },
        {
          chapter: 2,
          title: "Capítulo II: La llave entre las páginas",
          content: "Julian revisó el estante de partituras del siglo XIX. En el tomo correspondiente a las sonatas de violín de Tartini, encontró un hueco tallado en el lomo de cuero. Una pequeña llave de bronce descansaba allí, fría como el mármol de un mausoleo."
        }
      ]
    },
    {
      id: "book-3",
      title: "Crónicas del Silencio y el Ritmo",
      author: "Dr. Fernando Aránguiz",
      price: 22.00,
      rating: 4.9,
      genre: "Ensayo",
      badge: "Selección del Club",
      coverColor: "linear-gradient(135deg, #2e1065, #581c87, #c084fc)",
      coverIcon: "🎧",
      recommendedTrack: "Biblioteca en Otoño",
      description: "Una deslumbrante exploración sobre cómo la música altera la percepción del tiempo al leer y cómo los grandes autores desde Proust hasta Cortázar construían sus prosas con métricas de partitura sinfónica.",
      pagesCount: 280,
      previewChapters: [
        {
          chapter: 1,
          title: "Capítulo I: El tempo de la mente lectora",
          content: "No leemos con los ojos; leemos con el oído interno. Cada frase bien puntuada es un compás silencioso; cada punto y coma es una fermata donde la conciencia aguarda la resolución armónica del pensamiento. Cuando acompañamos la lectura con frecuencias acústicas regulares y cálidas, la corteza temporal entra en sincronía con la trama narrativa, creando una inmersión tridimensional irrepetible."
        },
        {
          chapter: 2,
          title: "Capítulo II: El swing de las palabras",
          content: "Cortázar decía que la prosa que no tiene swing se cae de las manos como un pájaro muerto. El swing en la escritura no es más que la osadía de romper la simetría métrica con el latido del corazón."
        }
      ]
    },
    {
      id: "book-4",
      title: "Sinfonía para Pájaros Nocturnos",
      author: "Isidora Miralles",
      price: 13.50,
      rating: 4.7,
      genre: "Poesía",
      badge: "Lírica",
      coverColor: "linear-gradient(135deg, #14532d, #166534, #22c55e)",
      coverIcon: "🌿",
      recommendedTrack: "Golden Hour Pages",
      description: "Versos que fluyen como piezas para piano en días de lluvia. Poemas breves, agudos y emotivos para leer mientras el mundo duerme y los auriculares te transportan a un bosque sereno.",
      pagesCount: 160,
      previewChapters: [
        {
          chapter: 1,
          title: "Canto I: El compás de las hojas secas",
          content: "Hay una música que solo se escucha\ncuando dejas de esperar respuestas.\nUn laúd invisible afinado con el peso de la niebla.\n\nAbres la página,\ny de pronto la habitación huele a madera de cedro\ny a lluvia de octubre sobre tejados ajenos."
        }
      ]
    },
    {
      id: "book-5",
      title: "Los Cuentos del Vinilo Olvidado",
      author: "Emilio Rostagno",
      price: 15.00,
      rating: 4.8,
      genre: "Fantasía",
      badge: "Recomendado",
      coverColor: "linear-gradient(135deg, #7c2d12, #9a3412, #ea580c)",
      coverIcon: "📻",
      recommendedTrack: "Chopin Nocturne Lofi Remix",
      description: "Siete relatos fantásticos sobre objetos musicales mágicos: gramófonos que reproducen conversaciones del futuro, casetes que devuelven recuerdos perdidos y radios que sintonizan emisoras de otras galaxias.",
      pagesCount: 210,
      previewChapters: [
        {
          chapter: 1,
          title: "Relato 1: La radio que transmitía desde 1954",
          content: "Tomás sintonizó 98.5 MHz en la vieja Telefunken de baquelita que heredó de su bisabuelo. Entre la estática crepitante emergió la voz nítida de un locutor hablando del clima de Buenos Aires... en julio de 1954. Lo más inquietante fue cuando el locutor dio la hora exacta, pidió un tango de Troilo y dedicó el siguiente corte comercial a 'Tomás, que nos escucha desde el futuro con café en mano'."
        }
      ]
    },
    {
      id: "book-6",
      title: "Acordes en el Silencio",
      author: "Valeria Montero",
      price: 19.00,
      rating: 4.9,
      genre: "Ficción Musical",
      badge: "Bestseller",
      coverColor: "linear-gradient(135deg, #831843, #be185d, #f43f5e)",
      coverIcon: "🎹",
      recommendedTrack: "Velvet Rain & Sax",
      description: "Una chelista que pierde temporalmente el oído y un afinador de pianos ciego que le enseña a sentir las vibraciones sonoras a través del tacto, la literatura y el amor incondicional.",
      pagesCount: 330,
      previewChapters: [
        {
          chapter: 1,
          title: "Capítulo I: El peso de la madera",
          content: "El silencio no era un vacío; tenía textura, densidad y una presión sofocante. Maia apoyó la mejilla derecha contra la curvatura del violonchelo. Cuando Marcos pasó el arco por la cuerda de Do, una ola de calor vibrante subió por el pómulo de Maia hasta hacerle temblar las pestañas."
        }
      ]
    }
  ],
  tracks: [
    {
      id: "track-1",
      title: "Midnight Lo-Fi Coffee",
      artist: "Beet & Book Chill Session",
      duration: "3:24",
      genre: "Lo-Fi Beats / Piano",
      mood: "Concentración & Lectura",
      cover: "☕",
      toneType: "lofi-rhodes",
      description: "Cálidos acordes de piano Rhodes con textura de vinilo crepitante y bajo suave, ideal para sumergirte en lecturas profundas."
    },
    {
      id: "track-2",
      title: "Velvet Rain & Sax",
      artist: "Nocturne Trio",
      duration: "4:12",
      genre: "Smooth Jazz Nocturno",
      mood: "Misterio & Noche",
      cover: "🎷",
      toneType: "smooth-jazz",
      description: "Saxofón aterciopelado con fondo de lluvia tenue y escobillas sobre caja de batería jazzera."
    },
    {
      id: "track-3",
      title: "Biblioteca en Otoño",
      artist: "Aura Cello & Keys",
      duration: "3:50",
      genre: "Neoclásico Acústico",
      mood: "Paz & Enfoque",
      cover: "🍂",
      toneType: "acoustic-piano",
      description: "Arpegios de piano suave entrelazados con cuerdas flotantes para calmar la mente y acelerar la comprensión lectora."
    },
    {
      id: "track-4",
      title: "Chopin Nocturne Lofi Remix",
      artist: "Classical Lo-Fi Lab",
      duration: "3:18",
      genre: "Lo-Fi Clásico",
      mood: "Reflexión",
      cover: "🎹",
      toneType: "chopin-lofi",
      description: "Reinterpretación contemporánea a 74 BPM del célebre Op. 9 No. 2 de Chopin con síncopa suave y pads ambientales."
    },
    {
      id: "track-5",
      title: "Golden Hour Pages",
      artist: "Solaria Acoustic",
      duration: "2:58",
      genre: "Guitarra Cálida & Ambiente",
      mood: "Inspiración",
      cover: "🌅",
      toneType: "warm-guitar",
      description: "Guitarra de cuerdas de nylon con eco etéreo y susurros de viento veraniego para tardes de poesía y ensayos."
    },
    {
      id: "track-6",
      title: "Lluvia Suave en el Tejado",
      artist: "Soundscapes Nature",
      duration: "5:00",
      genre: "Sonido Ambiental Puro",
      mood: "Aislamiento Total",
      cover: "🌧️",
      toneType: "rain-ambience",
      description: "Generador sonoro de lluvia constante con gotas en ventanas, eliminando cualquier distracción exterior."
    }
  ],
  communities: [
    {
      id: "comm-1",
      name: "Club de Jazz & Novela Negra",
      category: "Misterio & Ficción",
      icon: "🎷",
      bannerColor: "linear-gradient(135deg, #1e1b4b, #312e81)",
      bookId: "book-1",
      bookTitle: "El Eco del Jazz",
      featuredTrack: "Velvet Rain & Sax",
      creator: "Sofia_Reader",
      membersCount: 248,
      description: "Para quienes amamos leer con un saxofón de fondo y una taza de café solo. Compartimos teorías de tramas, citas favoritas y playlists jazzísticas.",
      discussions: [
        {
          id: "disc-101",
          author: "Sofia_Reader",
          avatar: "👩‍🦰",
          date: "Hace 2 horas",
          title: "¿Qué les pareció el acorde en Mi bemol del Capítulo 1?",
          content: "Me encantó la metáfora de Leo sobre cómo la música se desvanece mientras que los libros fijan las palabras. Creo que describe perfectamente la esencia de este club.",
          likes: 24,
          sharedTrack: "Velvet Rain & Sax",
          comments: [
            {
              author: "Carlos_Sax",
              avatar: "🧔",
              text: "Totalmente de acuerdo. Escuchar el track recomendado mientras leía esa escena me puso la piel de gallina.",
              date: "Hace 1 hora"
            },
            {
              author: "Lucia_V",
              avatar: "👩",
              text: "Esa cita la subrayé en mi cuaderno. Qué hermosa sensibilidad de autor.",
              date: "Hace 35 min"
            }
          ]
        },
        {
          id: "disc-102",
          author: "Marcos_B",
          avatar: "👨‍🎨",
          date: "Ayer",
          title: "Buscando libros similares que unan música y bohemia",
          content: "¿Alguien ha leído 'La Melodía de Medianoche'? Quiero saber si mantiene este mismo nivel de intriga sonora antes de comprarlo en la tienda.",
          likes: 12,
          sharedTrack: "Midnight Lo-Fi Coffee",
          comments: [
            {
              author: "Elena_Libros",
              avatar: "👩‍🎓",
              text: "¡Es excelente! Lo leí online el fin de semana pasado aquí mismo, tiene muchos enigmas fascinantes.",
              date: "Ayer"
            }
          ]
        }
      ]
    },
    {
      id: "comm-2",
      name: "Círculo de Filosofía Sonora",
      category: "Ensayo & Debate",
      icon: "🧠",
      bannerColor: "linear-gradient(135deg, #4c1d95, #6d28d9)",
      bookId: "book-3",
      bookTitle: "Crónicas del Silencio y el Ritmo",
      featuredTrack: "Biblioteca en Otoño",
      creator: "Profe_Dante",
      membersCount: 182,
      description: "Espacio de reflexión profunda sobre la estética literaria, la cadencia de la prosa y la resonancia cognitiva de la música.",
      discussions: [
        {
          id: "disc-201",
          author: "Profe_Dante",
          avatar: "👨‍🏫",
          date: "Hace 4 horas",
          title: "El ritmo interno al leer en voz alta vs en silencio",
          content: "El Dr. Aránguiz postula que leemos con el oído interno. ¿Han notado que según la canción que suena de fondo leen más rápido o más lento? Abro debate.",
          likes: 31,
          sharedTrack: "Biblioteca en Otoño",
          comments: [
            {
              author: "Valen_Mind",
              avatar: "👩‍🔬",
              text: "Absolutamente. Con el Lo-Fi de Chopin mi cerebro entra en estado theta y retengo mucho mejor las ideas complejas.",
              date: "Hace 2 horas"
            }
          ]
        }
      ]
    },
    {
      id: "comm-3",
      name: "Rincón Poético & Lo-Fi Tarde",
      category: "Poesía & Versos",
      icon: "🍃",
      bannerColor: "linear-gradient(135deg, #064e3b, #047857)",
      bookId: "book-4",
      bookTitle: "Sinfonía para Pájaros Nocturnos",
      featuredTrack: "Golden Hour Pages",
      creator: "Camila_Versos",
      membersCount: 134,
      description: "Poesía intimista, versos libres, café caliente y melodías de guitarra acústica para recargar el alma tras un día ajetreado.",
      discussions: [
        {
          id: "disc-301",
          author: "Camila_Versos",
          avatar: "👩‍🎤",
          date: "Hace 1 día",
          title: "Versos que se sienten como una caricia sonora",
          content: "'Hay una música que solo se escucha cuando dejas de esperar respuestas'. ¿Cuál es el verso que más les ha marcado de esta sinfonía?",
          likes: 19,
          sharedTrack: "Golden Hour Pages",
          comments: []
        }
      ]
    }
  ],
  friends: [
    {
      id: "user-1",
      name: "Sofia Ramírez",
      avatar: "👩‍🦰",
      status: "Leyendo 'El Eco del Jazz'",
      favoriteGenre: "Jazz & Ficción"
    },
    {
      id: "user-2",
      name: "Lucas Méndez",
      avatar: "🎧",
      status: "Escuchando 'Midnight Lo-Fi'",
      favoriteGenre: "Lo-Fi Beats"
    },
    {
      id: "user-3",
      name: "Elena Gómez",
      avatar: "👩‍🎓",
      status: "Escribiendo en Club de Jazz",
      favoriteGenre: "Misterio"
    },
    {
      id: "user-4",
      name: "Diego Salazar",
      avatar: "👨‍🎨",
      status: "Explorando la tienda online",
      favoriteGenre: "Filosofía"
    }
  ],
  receivedMusic: [
    {
      id: "rec-1",
      from: "Sofia Ramírez",
      avatar: "👩‍🦰",
      trackTitle: "Velvet Rain & Sax",
      note: "¡Hola! Te dedico esta canción para cuando leas el Capítulo 2 de 'El Eco del Jazz'. Combina perfecto.",
      date: "Hoy 10:15 AM",
      trackId: "track-2"
    }
  ]
};
