let getBlogEndPoint = "https://app-umbraco-multisite-staging.azurewebsites.net/umbraco/delivery/api/v1/content?filter=contentType%3AblogArticle&sort=name%3Aasc&skip=0&take=500";

// let parsedResponse = {
//   "total": 13,
//   "items": [
//     {
//       "name": "What’s economic growth?",
//       "createDate": "2023-08-01T10:28:50Z",
//       "updateDate": "2023-10-16T16:00:06.927Z",
//       "route": {
//         "path": "/blog/what-s-economic-growth/",
//         "startItem": {
//           "id": "68f3e929-d00c-48b7-b313-c89086636804",
//           "path": "west-midlands-combined-authority"
//         }
//       },
//       "id": "5f9d4636-b0d6-4451-8919-10dfe9fc3919",
//       "contentType": "blogArticle",
//       "properties": {
//         "grid": null,
//         "date": "2023-01-01T15:15:00Z",
//         "introduction": "Energy infrastructure giant, SSE Energy Solutions, and the West Midlands Combined Authority (WMCA), have signed an agreement that will see them work together on new clean energy projects across the region.",
//         "image": [
//           {
//             "id": "96a5c56c-6b28-42c5-8471-7358296b20a3",
//             "name": "Carlos Muza Hpjsku2uysu Unsplash",
//             "mediaType": "Image",
//             "url": "/media/nlcllfri/carlos-muza-hpjsku2uysu-unsplash.jpg",
//             "extension": "",
//             "width": 0,
//             "height": 0,
//             "bytes": 0,
//             "properties": {},
//             "focalPoint": null,
//             "crops": [
//               {
//                 "alias": "Banner",
//                 "width": 3000,
//                 "height": 1500,
//                 "coordinates": null
//               },
//               {
//                 "alias": "Content Card - Square",
//                 "width": 300,
//                 "height": 300,
//                 "coordinates": null
//               }
//             ]
//           }
//         ],
//         "hideImageInBlog": false,
//         "tags": [
//           "Inclusive growth"
//         ],
//         "author": [
//           {
//             "name": "Lucas Frost",
//             "createDate": "2023-08-09T12:25:26Z",
//             "updateDate": "2023-10-16T16:00:10.297Z",
//             "route": {
//               "path": "/authors/lucas-frost/",
//               "startItem": {
//                 "id": "68f3e929-d00c-48b7-b313-c89086636804",
//                 "path": "west-midlands-combined-authority"
//               }
//             },
//             "id": "a860777a-4210-4092-bc70-e5e5509b2d39",
//             "contentType": "author",
//             "properties": {}
//           }
//         ]
//       },
//       "cultures": {}
//     },
//     {
//       "name": "What does inclusive growth mean?",
//       "createDate": "2023-08-01T10:29:05Z",
//       "updateDate": "2023-10-16T16:00:09.197Z",
//       "route": {
//         "path": "/blog/what-does-inclusive-growth-mean/",
//         "startItem": {
//           "id": "68f3e929-d00c-48b7-b313-c89086636804",
//           "path": "west-midlands-combined-authority"
//         }
//       },
//       "id": "4fa36a53-1500-4909-aa2f-ab617f2c168d",
//       "contentType": "blogArticle",
//       "properties": {
//         "grid": null,
//         "date": "2023-02-01T16:00:00Z",
//         "introduction": "A £140 million project to create the UK’s first all-electric bus city by 2025 has taken a major step forward with National Express Coventry now operating 130 new double-decker zero emission all-electric buses in Coventry.  \n\nAll 130 Enviro400 electric buses are UK-built in Falkirk by Alexander Dennis on a BYD chassis. The buses produce zero carbon emissions at the tailpipe and are powered by renewable ‘green’ energy thanks to solar panels, a second-life battery and charge-point infrastructure all installed at National Express Coventry’s bus depot by electrification specialist Zenobē. The electric buses take four hours to charge and can run for up to 175 miles depending on the time of year.",
//         "image": [
//           {
//             "id": "f3bdd832-3bc1-43db-a5fa-1ccbc13291ee",
//             "name": "Ben White W8qqn1pmqh0 Unsplash",
//             "mediaType": "Image",
//             "url": "/media/gtml124b/ben-white-w8qqn1pmqh0-unsplash.jpg",
//             "extension": "",
//             "width": 0,
//             "height": 0,
//             "bytes": 0,
//             "properties": {},
//             "focalPoint": null,
//             "crops": [
//               {
//                 "alias": "Banner",
//                 "width": 3000,
//                 "height": 1500,
//                 "coordinates": null
//               },
//               {
//                 "alias": "Content Card - Square",
//                 "width": 300,
//                 "height": 300,
//                 "coordinates": null
//               }
//             ]
//           }
//         ],
//         "hideImageInBlog": false,
//         "tags": [
//           "Skills, education and careers",
//           "Life in the West Midlands",
//           "Economy"
//         ],
//         "author": [
//           {
//             "name": "Hayden Ingram",
//             "createDate": "2023-08-09T12:26:05Z",
//             "updateDate": "2023-10-16T16:00:11.253Z",
//             "route": {
//               "path": "/authors/hayden-ingram/",
//               "startItem": {
//                 "id": "68f3e929-d00c-48b7-b313-c89086636804",
//                 "path": "west-midlands-combined-authority"
//               }
//             },
//             "id": "9e00edfd-6b8d-41c2-a82c-2d1eb54f82e8",
//             "contentType": "author",
//             "properties": {}
//           },
//           {
//             "name": "Lucas Frost",
//             "createDate": "2023-08-09T12:25:26Z",
//             "updateDate": "2023-10-16T16:00:10.297Z",
//             "route": {
//               "path": "/authors/lucas-frost/",
//               "startItem": {
//                 "id": "68f3e929-d00c-48b7-b313-c89086636804",
//                 "path": "west-midlands-combined-authority"
//               }
//             },
//             "id": "a860777a-4210-4092-bc70-e5e5509b2d39",
//             "contentType": "author",
//             "properties": {}
//           }
//         ]
//       },
//       "cultures": {}
//     },
//     {
//       "name": "What’s inclusive growth?",
//       "createDate": "2023-08-03T14:39:39Z",
//       "updateDate": "2023-10-16T16:00:09.737Z",
//       "route": {
//         "path": "/blog/what-s-inclusive-growth/",
//         "startItem": {
//           "id": "68f3e929-d00c-48b7-b313-c89086636804",
//           "path": "west-midlands-combined-authority"
//         }
//       },
//       "id": "67a5d323-b043-4e45-a3c7-187a1d848dd3",
//       "contentType": "blogArticle",
//       "properties": {
//         "grid": null,
//         "date": "2023-09-12T08:00:00Z",
//         "introduction": "Courses offered by City of Wolverhampton College to give people the skills needed to build a career in the rail and infrastructure sectors are set to be expanded with the opening of an additional training site in Dudley. ",
//         "image": [
//           {
//             "id": "652672f2-55dc-4612-bf07-d291b8febfdf",
//             "name": "Leone Venter Viem9bdzkfo Unsplash",
//             "mediaType": "Image",
//             "url": "/media/4rzcmzo2/leone-venter-viem9bdzkfo-unsplash.jpg",
//             "extension": "",
//             "width": 0,
//             "height": 0,
//             "bytes": 0,
//             "properties": {},
//             "focalPoint": null,
//             "crops": [
//               {
//                 "alias": "Banner",
//                 "width": 3000,
//                 "height": 1500,
//                 "coordinates": null
//               },
//               {
//                 "alias": "Content Card - Square",
//                 "width": 300,
//                 "height": 300,
//                 "coordinates": null
//               }
//             ]
//           }
//         ],
//         "hideImageInBlog": false,
//         "tags": [
//           "Skills, education and careers",
//           "Life in the West Midlands",
//           "Economy"
//         ],
//         "author": [
//           {
//             "name": "Phoebe Russell",
//             "createDate": "2023-08-09T12:29:36Z",
//             "updateDate": "2023-10-16T16:00:06.637Z",
//             "route": {
//               "path": "/authors/phoebe-russell/",
//               "startItem": {
//                 "id": "68f3e929-d00c-48b7-b313-c89086636804",
//                 "path": "west-midlands-combined-authority"
//               }
//             },
//             "id": "899e1392-e5ce-400a-a222-f33f3317d185",
//             "contentType": "author",
//             "properties": {}
//           }
//         ]
//       },
//       "cultures": {}
//     },
//     {
//       "name": "Inclusive growth vs economic growth: 7 important differences you need to know",
//       "createDate": "2023-08-03T14:40:01Z",
//       "updateDate": "2023-10-16T16:00:10.703Z",
//       "route": {
//         "path": "/blog/inclusive-growth-vs-economic-growth-7-important-differences-you-need-to-know/",
//         "startItem": {
//           "id": "68f3e929-d00c-48b7-b313-c89086636804",
//           "path": "west-midlands-combined-authority"
//         }
//       },
//       "id": "3cc05799-7e19-4423-88a3-c99f23a1abe3",
//       "contentType": "blogArticle",
//       "properties": {
//         "grid": null,
//         "date": "2023-09-21T19:00:00Z",
//         "introduction": "The Mayor of the West Midlands, Andy Street, will sign up to the UK Steel Charter, in a historic move to promote UK-made steel in the region and support the economy. \n\nThe first metro Mayor in the UK to sign the charter, Mayor Street today (Wednesday) said there were “lots of opportunities” for West Midlands-based firms to purchase domestic steel and has called for firms to commit themselves “wherever possible” to UK steel jobs.",
//         "image": null,
//         "hideImageInBlog": false,
//         "tags": [
//           "Skills, education and careers",
//           "Life in the West Midlands",
//           "Equality and diversity"
//         ],
//         "author": [
//           {
//             "name": "Courtney Swift",
//             "createDate": "2023-08-09T12:26:33Z",
//             "updateDate": "2023-10-16T16:00:11.527Z",
//             "route": {
//               "path": "/authors/courtney-swift/",
//               "startItem": {
//                 "id": "68f3e929-d00c-48b7-b313-c89086636804",
//                 "path": "west-midlands-combined-authority"
//               }
//             },
//             "id": "9f250014-9e32-49ed-9d81-5a12169684fc",
//             "contentType": "author",
//             "properties": {}
//           }
//         ]
//       },
//       "cultures": {}
//     },
//     {
//       "name": "How inclusive growth is measured/calculated?",
//       "createDate": "2023-08-03T14:41:17Z",
//       "updateDate": "2023-10-16T16:00:11.817Z",
//       "route": {
//         "path": "/blog/how-inclusive-growth-is-measuredcalculated/",
//         "startItem": {
//           "id": "68f3e929-d00c-48b7-b313-c89086636804",
//           "path": "west-midlands-combined-authority"
//         }
//       },
//       "id": "6edbf41b-98b3-44c3-894c-af5294c92a33",
//       "contentType": "blogArticle",
//       "properties": {
//         "grid": null,
//         "date": "2023-09-10T07:00:00Z",
//         "introduction": "Nearly 10,000 people have been helped in learning the skills needed to work in the region’s engineering and manufacturing sectors thanks to a £22 million investment by the West Midlands Combined Authority (WMCA).",
//         "image": null,
//         "hideImageInBlog": false,
//         "tags": [
//           "Skills, education and careers",
//           "Life in the West Midlands",
//           "Equality and diversity"
//         ],
//         "author": [
//           {
//             "name": "Hayden Ingram",
//             "createDate": "2023-08-09T12:26:05Z",
//             "updateDate": "2023-10-16T16:00:11.253Z",
//             "route": {
//               "path": "/authors/hayden-ingram/",
//               "startItem": {
//                 "id": "68f3e929-d00c-48b7-b313-c89086636804",
//                 "path": "west-midlands-combined-authority"
//               }
//             },
//             "id": "9e00edfd-6b8d-41c2-a82c-2d1eb54f82e8",
//             "contentType": "author",
//             "properties": {}
//           },
//           {
//             "name": "Phoebe Russell",
//             "createDate": "2023-08-09T12:29:36Z",
//             "updateDate": "2023-10-16T16:00:06.637Z",
//             "route": {
//               "path": "/authors/phoebe-russell/",
//               "startItem": {
//                 "id": "68f3e929-d00c-48b7-b313-c89086636804",
//                 "path": "west-midlands-combined-authority"
//               }
//             },
//             "id": "899e1392-e5ce-400a-a222-f33f3317d185",
//             "contentType": "author",
//             "properties": {}
//           }
//         ]
//       },
//       "cultures": {}
//     },
//     {
//       "name": "What are the benefits of inclusive growth?",
//       "createDate": "2023-08-08T09:56:08Z",
//       "updateDate": "2023-10-16T16:00:12.373Z",
//       "route": {
//         "path": "/blog/what-are-the-benefits-of-inclusive-growth/",
//         "startItem": {
//           "id": "68f3e929-d00c-48b7-b313-c89086636804",
//           "path": "west-midlands-combined-authority"
//         }
//       },
//       "id": "c95de18d-11a7-45b9-bbcb-1e920e97b569",
//       "contentType": "blogArticle",
//       "properties": {
//         "grid": null,
//         "date": "2023-06-01T11:45:00Z",
//         "introduction": "University College Birmingham will lead the way in a regional partnership delivering an innovative new project aimed at re-skilling, upskilling and growing new skills in battery manufacturing and innovation.",
//         "image": null,
//         "hideImageInBlog": false,
//         "tags": [
//           "Skills, education and careers",
//           "Life in the West Midlands",
//           "Equality and diversity"
//         ],
//         "author": [
//           {
//             "name": "Lucas Frost",
//             "createDate": "2023-08-09T12:25:26Z",
//             "updateDate": "2023-10-16T16:00:10.297Z",
//             "route": {
//               "path": "/authors/lucas-frost/",
//               "startItem": {
//                 "id": "68f3e929-d00c-48b7-b313-c89086636804",
//                 "path": "west-midlands-combined-authority"
//               }
//             },
//             "id": "a860777a-4210-4092-bc70-e5e5509b2d39",
//             "contentType": "author",
//             "properties": {}
//           }
//         ]
//       },
//       "cultures": {}
//     },
//     {
//       "name": "Is inclusive growth possible in market economy?",
//       "createDate": "2023-08-16T09:50:14Z",
//       "updateDate": "2023-11-07T17:42:46.903Z",
//       "route": {
//         "path": "/blog/is-inclusive-growth-possible-in-market-economy/",
//         "startItem": {
//           "id": "68f3e929-d00c-48b7-b313-c89086636804",
//           "path": "west-midlands-combined-authority"
//         }
//       },
//       "id": "d79f911a-bc61-4e7a-95d7-180ed0e86c84",
//       "contentType": "blogArticle",
//       "properties": {
//         "grid": null,
//         "date": "2023-08-14T06:00:00Z",
//         "introduction": "The West Midlands Combined Authority recently negotiated a devolution deal with the UK government, which grants the region greater control over issues like transportation, housing, and economic development. In this post, we'll explain what the devolution deal entails, what it means for residents of the West Midlands, and how WMCA plans to use the new powers.",
//         "image": [
//           {
//             "id": "5e459a8e-f427-4299-b6f8-cf5c7f873959",
//             "name": "Lukas Blazek Gnvurwjskay Unsplash",
//             "mediaType": "Image",
//             "url": "/media/rcnekxrh/lukas-blazek-gnvurwjskay-unsplash.jpg",
//             "extension": "",
//             "width": 0,
//             "height": 0,
//             "bytes": 0,
//             "properties": {},
//             "focalPoint": null,
//             "crops": [
//               {
//                 "alias": "Banner",
//                 "width": 3000,
//                 "height": 1500,
//                 "coordinates": null
//               },
//               {
//                 "alias": "Content Card - Square",
//                 "width": 300,
//                 "height": 300,
//                 "coordinates": null
//               }
//             ]
//           }
//         ],
//         "hideImageInBlog": false,
//         "tags": [
//           "Skills, education and careers",
//           "Life in the West Midlands",
//           "Equality and diversity"
//         ],
//         "author": [
//           {
//             "name": "Courtney Swift",
//             "createDate": "2023-08-09T12:26:33Z",
//             "updateDate": "2023-10-16T16:00:11.527Z",
//             "route": {
//               "path": "/authors/courtney-swift/",
//               "startItem": {
//                 "id": "68f3e929-d00c-48b7-b313-c89086636804",
//                 "path": "west-midlands-combined-authority"
//               }
//             },
//             "id": "9f250014-9e32-49ed-9d81-5a12169684fc",
//             "contentType": "author",
//             "properties": {}
//           }
//         ]
//       },
//       "cultures": {}
//     },
//     {
//       "name": "Why is inclusive growth good?",
//       "createDate": "2023-08-08T09:56:36Z",
//       "updateDate": "2023-11-08T09:11:48.267Z",
//       "route": {
//         "path": "/blog/why-is-inclusive-growth-good/",
//         "startItem": {
//           "id": "68f3e929-d00c-48b7-b313-c89086636804",
//           "path": "west-midlands-combined-authority"
//         }
//       },
//       "id": "1ac303bd-196e-4099-8c6e-7129d4d82875",
//       "contentType": "blogArticle",
//       "properties": {
//         "grid": null,
//         "date": "2023-08-01T03:00:00Z",
//         "introduction": "Over 1,000 established business owners and entrepreneurs in the West Midlands will attend a business support event in Coventry to help expand and scale up their operations.\n\nBusiness Growth West Midlands (BGWM), a newly established business support service in partnership with the region’s seven local authorities, will help new business access skills, training, and job opportunities.",
//         "image": null,
//         "hideImageInBlog": false,
//         "tags": [
//           "Skills, education and careers",
//           "Life in the West Midlands",
//           "Equality and diversity"
//         ],
//         "author": [
//           {
//             "name": "Hayden Ingram",
//             "createDate": "2023-08-09T12:26:05Z",
//             "updateDate": "2023-10-16T16:00:11.253Z",
//             "route": {
//               "path": "/authors/hayden-ingram/",
//               "startItem": {
//                 "id": "68f3e929-d00c-48b7-b313-c89086636804",
//                 "path": "west-midlands-combined-authority"
//               }
//             },
//             "id": "9e00edfd-6b8d-41c2-a82c-2d1eb54f82e8",
//             "contentType": "author",
//             "properties": {}
//           }
//         ]
//       },
//       "cultures": {}
//     },
//     {
//       "name": "How can inclusive growth be achieved?",
//       "createDate": "2023-08-16T09:49:03Z",
//       "updateDate": "2023-11-08T11:07:53.133Z",
//       "route": {
//         "path": "/blog/how-can-inclusive-growth-be-achieved/",
//         "startItem": {
//           "id": "68f3e929-d00c-48b7-b313-c89086636804",
//           "path": "west-midlands-combined-authority"
//         }
//       },
//       "id": "bc9959ac-dec9-43e8-9fae-4d0f98ec298a",
//       "contentType": "blogArticle",
//       "properties": {
//         "grid": {
//           "items": [
//             {
//               "content": {
//                 "id": "7196016e-f42a-47fd-981e-5f476fbabf6d",
//                 "contentType": "blogLayoutBlock",
//                 "properties": {
//                   "content": {
//                     "items": [
//                       {
//                         "content": {
//                           "id": "51c39b29-ae19-4405-931f-8131aa613cca",
//                           "contentType": "textboxBlock",
//                           "properties": {
//                             "textbox": {
//                               "markup": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>"
//                             }
//                           }
//                         },
//                         "settings": null
//                       },
//                       {
//                         "content": {
//                           "id": "02bdd451-20b2-4778-9066-93b2d3778680",
//                           "contentType": "imageBlock",
//                           "properties": {
//                             "image": [
//                               {
//                                 "id": "75e4665a-6658-4078-84bd-0ab40f3cb84a",
//                                 "name": "IMG 6836",
//                                 "mediaType": "Image",
//                                 "url": "/media/lrtoi3ky/img_6836.jpeg",
//                                 "extension": "jpeg",
//                                 "width": 4752,
//                                 "height": 3168,
//                                 "bytes": 4091632,
//                                 "properties": {},
//                                 "focalPoint": null,
//                                 "crops": [
//                                   {
//                                     "alias": "Banner",
//                                     "width": 3000,
//                                     "height": 1500,
//                                     "coordinates": null
//                                   },
//                                   {
//                                     "alias": "Content Card - Square",
//                                     "width": 300,
//                                     "height": 300,
//                                     "coordinates": null
//                                   }
//                                 ]
//                               }
//                             ]
//                           }
//                         },
//                         "settings": null
//                       }
//                     ]
//                   },
//                   "sidebar": {
//                     "items": [
//                       {
//                         "content": {
//                           "id": "06aa0cd8-9dd1-4a0c-83b3-db11e717b577",
//                           "contentType": "contentCardBlock",
//                           "properties": {
//                             "image": [
//                               {
//                                 "id": "75e4665a-6658-4078-84bd-0ab40f3cb84a",
//                                 "name": "IMG 6836",
//                                 "mediaType": "Image",
//                                 "url": "/media/lrtoi3ky/img_6836.jpeg",
//                                 "extension": "jpeg",
//                                 "width": 4752,
//                                 "height": 3168,
//                                 "bytes": 4091632,
//                                 "properties": {},
//                                 "focalPoint": null,
//                                 "crops": [
//                                   {
//                                     "alias": "Banner",
//                                     "width": 3000,
//                                     "height": 1500,
//                                     "coordinates": null
//                                   },
//                                   {
//                                     "alias": "Content Card - Square",
//                                     "width": 300,
//                                     "height": 300,
//                                     "coordinates": null
//                                   }
//                                 ]
//                               }
//                             ],
//                             "title": "This is a test",
//                             "content": {
//                               "markup": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>"
//                             },
//                             "link": [
//                               {
//                                 "url": null,
//                                 "title": "West Midlands Combined Authority",
//                                 "target": null,
//                                 "destinationId": "68f3e929-d00c-48b7-b313-c89086636804",
//                                 "destinationType": "homepageWmca",
//                                 "route": {
//                                   "path": "/",
//                                   "startItem": {
//                                     "id": "68f3e929-d00c-48b7-b313-c89086636804",
//                                     "path": "west-midlands-combined-authority"
//                                   }
//                                 },
//                                 "linkType": "Content"
//                               }
//                             ]
//                           }
//                         },
//                         "settings": null
//                       }
//                     ]
//                   }
//                 }
//               },
//               "settings": null
//             }
//           ]
//         },
//         "date": "2023-09-19T06:00:00Z",
//         "introduction": "Measures to improve road safety across the region, including enhanced average speed camera enforcement and a crackdown on mobile phone use while driving, are to be rolled out following the adoption of a new region wide strategy.\n\nThe Refreshed Regional Road Safety Strategy 2023-2030 has been drawn up in consultation with a range of partners including local authorities and the emergency services and agreed by the West Midlands Combined Authority (WMCA) Board.",
//         "image": null,
//         "hideImageInBlog": false,
//         "tags": [
//           "Skills, education and careers",
//           "Life in the West Midlands",
//           "Equality and diversity"
//         ],
//         "author": [
//           {
//             "name": "Courtney Swift",
//             "createDate": "2023-08-09T12:26:33Z",
//             "updateDate": "2023-10-16T16:00:11.527Z",
//             "route": {
//               "path": "/authors/courtney-swift/",
//               "startItem": {
//                 "id": "68f3e929-d00c-48b7-b313-c89086636804",
//                 "path": "west-midlands-combined-authority"
//               }
//             },
//             "id": "9f250014-9e32-49ed-9d81-5a12169684fc",
//             "contentType": "author",
//             "properties": {}
//           }
//         ]
//       },
//       "cultures": {}
//     },
//     {
//       "name": "Why does inclusive growth matter in economics?",
//       "createDate": "2023-08-16T09:48:24Z",
//       "updateDate": "2023-11-08T11:38:23.16Z",
//       "route": {
//         "path": "/blog/why-does-inclusive-growth-matter-in-economics/",
//         "startItem": {
//           "id": "68f3e929-d00c-48b7-b313-c89086636804",
//           "path": "west-midlands-combined-authority"
//         }
//       },
//       "id": "5aff46da-d0b3-4638-a3bd-6f4f170437b4",
//       "contentType": "blogArticle",
//       "properties": {
//         "grid": {
//           "items": [
//             {
//               "content": {
//                 "id": "7bfb768b-b219-48c1-a792-bfa84c30083d",
//                 "contentType": "blogLayoutBlock",
//                 "properties": {
//                   "content": {
//                     "items": [
//                       {
//                         "content": {
//                           "id": "90c2f14b-6a4e-47a7-9604-11ac067e1797",
//                           "contentType": "textboxBlock",
//                           "properties": {
//                             "textbox": {
//                               "markup": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quam vulputate dignissim suspendisse in est ante in nibh mauris. Diam quam nulla porttitor massa. Eget aliquet nibh praesent tristique. Semper viverra nam libero justo laoreet sit amet cursus sit. Porttitor rhoncus dolor purus non enim praesent elementum facilisis. Senectus et netus et malesuada fames ac turpis egestas sed. Tincidunt vitae semper quis lectus nulla at volutpat diam. Pharetra massa massa ultricies mi. Enim nulla aliquet porttitor lacus luctus accumsan. Fringilla urna porttitor rhoncus dolor purus. Curabitur gravida arcu ac tortor dignissim convallis aenean. Nunc sed id semper risus in hendrerit gravida rutrum. Suscipit adipiscing bibendum est ultricies. Felis imperdiet proin fermentum leo vel orci porta non. Ut tristique et egestas quis ipsum suspendisse ultrices. In dictum non consectetur a erat nam at lectus urna. Amet mattis vulputate enim nulla aliquet. Molestie a iaculis at erat pellentesque adipiscing commodo elit at.</p>\n<p>Nisi scelerisque eu ultrices vitae. Ullamcorper morbi tincidunt ornare massa eget. Scelerisque eleifend donec pretium vulputate sapien nec sagittis aliquam. Faucibus in ornare quam viverra orci sagittis eu volutpat odio. Congue quisque egestas diam in arcu cursus euismod. Metus dictum at tempor commodo. Egestas sed sed risus pretium. Eleifend quam adipiscing vitae proin sagittis nisl. Mauris sit amet massa vitae tortor. Congue eu consequat ac felis. Arcu vitae elementum curabitur vitae nunc sed. Morbi tristique senectus et netus. Ultricies lacus sed turpis tincidunt id aliquet risus feugiat in.</p>"
//                             }
//                           }
//                         },
//                         "settings": null
//                       }
//                     ]
//                   },
//                   "sidebar": null
//                 }
//               },
//               "settings": null
//             }
//           ]
//         },
//         "date": "2023-08-14T06:00:00Z",
//         "introduction": "This September marks the celebration of Catch the Bus Month, organised by Bus Users UK, and Transport for West Midlands (TfWM) participated by hosting an event at Millennium Place in Coventry.",
//         "image": [
//           {
//             "id": "f27be305-d709-4b5f-8fac-4d426aa25ba1",
//             "name": "Andrew Neel Cckf4tshauw Unsplash",
//             "mediaType": "Image",
//             "url": "/media/aprhx2qj/andrew-neel-cckf4tshauw-unsplash.jpg",
//             "extension": "",
//             "width": 0,
//             "height": 0,
//             "bytes": 0,
//             "properties": {},
//             "focalPoint": null,
//             "crops": [
//               {
//                 "alias": "Banner",
//                 "width": 3000,
//                 "height": 1500,
//                 "coordinates": null
//               },
//               {
//                 "alias": "Content Card - Square",
//                 "width": 300,
//                 "height": 300,
//                 "coordinates": null
//               }
//             ]
//           }
//         ],
//         "hideImageInBlog": false,
//         "tags": [
//           "Skills, education and careers",
//           "Life in the West Midlands",
//           "Equality and diversity"
//         ],
//         "author": [
//           {
//             "name": "Courtney Swift",
//             "createDate": "2023-08-09T12:26:33Z",
//             "updateDate": "2023-10-16T16:00:11.527Z",
//             "route": {
//               "path": "/authors/courtney-swift/",
//               "startItem": {
//                 "id": "68f3e929-d00c-48b7-b313-c89086636804",
//                 "path": "west-midlands-combined-authority"
//               }
//             },
//             "id": "9f250014-9e32-49ed-9d81-5a12169684fc",
//             "contentType": "author",
//             "properties": {}
//           }
//         ]
//       },
//       "cultures": {}
//     },
//     {
//       "name": "Inclusive growth vs inflation",
//       "createDate": "2023-08-16T09:47:49Z",
//       "updateDate": "2023-11-08T11:39:18.41Z",
//       "route": {
//         "path": "/blog/inclusive-growth-vs-inflation/",
//         "startItem": {
//           "id": "68f3e929-d00c-48b7-b313-c89086636804",
//           "path": "west-midlands-combined-authority"
//         }
//       },
//       "id": "ba0bd591-bf52-4f8b-ab28-0b8d19c71c15",
//       "contentType": "blogArticle",
//       "properties": {
//         "grid": {
//           "items": [
//             {
//               "content": {
//                 "id": "0a708d63-eb39-4c18-93fe-cdf44876d552",
//                 "contentType": "blogLayoutBlock",
//                 "properties": {
//                   "content": {
//                     "items": [
//                       {
//                         "content": {
//                           "id": "c32278d4-2878-4a2d-bcd9-86729957c2d6",
//                           "contentType": "textboxBlock",
//                           "properties": {
//                             "textbox": {
//                               "markup": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Blandit massa enim nec dui nunc. Condimentum lacinia quis vel eros donec ac odio. Sem et tortor consequat id porta nibh venenatis. Quis risus sed vulputate odio. Aliquam faucibus purus in massa tempor nec feugiat. Morbi tristique senectus et netus et malesuada fames. Diam sollicitudin tempor id eu nisl. Mauris sit amet massa vitae tortor condimentum. Volutpat maecenas volutpat blandit aliquam etiam erat velit. Fermentum posuere urna nec tincidunt. At augue eget arcu dictum varius duis at consectetur. Nibh nisl condimentum id venenatis a condimentum. Pellentesque elit eget gravida cum. Eget dolor morbi non arcu risus quis. Aliquet eget sit amet tellus cras adipiscing enim eu. Rutrum tellus pellentesque eu tincidunt tortor. Varius sit amet mattis vulputate enim nulla aliquet.</p>\n<p>Commodo sed egestas egestas fringilla phasellus faucibus scelerisque eleifend. Vulputate odio ut enim blandit volutpat maecenas volutpat blandit aliquam. Sollicitudin aliquam ultrices sagittis orci a scelerisque purus semper eget. Enim ut sem viverra aliquet. Felis donec et odio pellentesque. Nulla malesuada pellentesque elit eget gravida cum. Malesuada bibendum arcu vitae elementum curabitur. Tempor orci dapibus ultrices in iaculis nunc sed augue lacus. Fermentum et sollicitudin ac orci phasellus egestas. Neque laoreet suspendisse interdum consectetur libero id faucibus nisl. Enim blandit volutpat maecenas volutpat blandit.</p>\n<p>Malesuada bibendum arcu vitae elementum curabitur. Lectus proin nibh nisl condimentum id venenatis a. Porttitor leo a diam sollicitudin tempor id eu nisl. Nisi lacus sed viverra tellus. Phasellus faucibus scelerisque eleifend donec pretium. Lorem dolor sed viverra ipsum. Tincidunt vitae semper quis lectus nulla at volutpat diam. Eu tincidunt tortor aliquam nulla facilisi cras fermentum. Metus dictum at tempor commodo ullamcorper a. Nulla porttitor massa id neque aliquam vestibulum morbi blandit. Aliquam nulla facilisi cras fermentum odio. Morbi blandit cursus risus at ultrices mi tempus imperdiet. Sit amet nisl suscipit adipiscing bibendum est ultricies. Consectetur adipiscing elit pellentesque habitant. Magnis dis parturient montes nascetur ridiculus. Fermentum dui faucibus in ornare.</p>"
//                             }
//                           }
//                         },
//                         "settings": null
//                       },
//                       {
//                         "content": {
//                           "id": "f777fbc3-71d7-454d-862c-9cbb5fee9a24",
//                           "contentType": "imageBlock",
//                           "properties": {
//                             "image": [
//                               {
//                                 "id": "e4a6b27a-6a48-4c65-abe9-aae1eb190d45",
//                                 "name": "Untitled 2500 800Px",
//                                 "mediaType": "Image",
//                                 "url": "/media/pszknzci/untitled-2500-800px.png",
//                                 "extension": "png",
//                                 "width": 2500,
//                                 "height": 800,
//                                 "bytes": 4611301,
//                                 "properties": {},
//                                 "focalPoint": null,
//                                 "crops": [
//                                   {
//                                     "alias": "Banner",
//                                     "width": 3000,
//                                     "height": 1500,
//                                     "coordinates": null
//                                   },
//                                   {
//                                     "alias": "Content Card - Square",
//                                     "width": 300,
//                                     "height": 300,
//                                     "coordinates": null
//                                   }
//                                 ]
//                               }
//                             ]
//                           }
//                         },
//                         "settings": null
//                       }
//                     ]
//                   },
//                   "sidebar": null
//                 }
//               },
//               "settings": null
//             }
//           ]
//         },
//         "date": "2023-08-14T06:00:00Z",
//         "introduction": "Passenger tram services on the new West Midlands Metro extension in Wolverhampton City Centre are set to begin from this Sunday, 17 September.\n\nThe £50 million extension creates two new tram stops at Pipers Row and Wolverhampton Railway Station, offering seamless connections to bus and train services helping to create a major public transport hub for the city.",
//         "image": null,
//         "hideImageInBlog": false,
//         "tags": [
//           "Skills, education and careers",
//           "Life in the West Midlands",
//           "Equality and diversity"
//         ],
//         "author": [
//           {
//             "name": "Courtney Swift",
//             "createDate": "2023-08-09T12:26:33Z",
//             "updateDate": "2023-10-16T16:00:11.527Z",
//             "route": {
//               "path": "/authors/courtney-swift/",
//               "startItem": {
//                 "id": "68f3e929-d00c-48b7-b313-c89086636804",
//                 "path": "west-midlands-combined-authority"
//               }
//             },
//             "id": "9f250014-9e32-49ed-9d81-5a12169684fc",
//             "contentType": "author",
//             "properties": {}
//           }
//         ]
//       },
//       "cultures": {}
//     },
//     {
//       "name": "Economic growth in the West Midlands: why being inclusive is key to our future",
//       "createDate": "2023-08-16T09:46:51Z",
//       "updateDate": "2023-11-08T11:39:37.713Z",
//       "route": {
//         "path": "/blog/economic-growth-in-the-west-midlands-why-being-inclusive-is-key-to-our-future/",
//         "startItem": {
//           "id": "68f3e929-d00c-48b7-b313-c89086636804",
//           "path": "west-midlands-combined-authority"
//         }
//       },
//       "id": "c460b087-7bbc-426f-938b-2f1eb89da2a7",
//       "contentType": "blogArticle",
//       "properties": {
//         "grid": {
//           "items": [
//             {
//               "content": {
//                 "id": "8411ad14-bae7-465f-995b-9d1eb1bbea28",
//                 "contentType": "blogLayoutBlock",
//                 "properties": {
//                   "content": {
//                     "items": [
//                       {
//                         "content": {
//                           "id": "7d11a45b-41bb-43ed-a17a-539376a7850f",
//                           "contentType": "textboxBlock",
//                           "properties": {
//                             "textbox": {
//                               "markup": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Blandit massa enim nec dui nunc. Condimentum lacinia quis vel eros donec ac odio. Sem et tortor consequat id porta nibh venenatis. Quis risus sed vulputate odio. Aliquam faucibus purus in massa tempor nec feugiat. Morbi tristique senectus et netus et malesuada fames. Diam sollicitudin tempor id eu nisl. Mauris sit amet massa vitae tortor condimentum. Volutpat maecenas volutpat blandit aliquam etiam erat velit. Fermentum posuere urna nec tincidunt. At augue eget arcu dictum varius duis at consectetur. Nibh nisl condimentum id venenatis a condimentum. Pellentesque elit eget gravida cum. Eget dolor morbi non arcu risus quis. Aliquet eget sit amet tellus cras adipiscing enim eu. Rutrum tellus pellentesque eu tincidunt tortor. Varius sit amet mattis vulputate enim nulla aliquet.</p>\n<p>Commodo sed egestas egestas fringilla phasellus faucibus scelerisque eleifend. Vulputate odio ut enim blandit volutpat maecenas volutpat blandit aliquam. Sollicitudin aliquam ultrices sagittis orci a scelerisque purus semper eget. Enim ut sem viverra aliquet. Felis donec et odio pellentesque. Nulla malesuada pellentesque elit eget gravida cum. Malesuada bibendum arcu vitae elementum curabitur. Tempor orci dapibus ultrices in iaculis nunc sed augue lacus. Fermentum et sollicitudin ac orci phasellus egestas. Neque laoreet suspendisse interdum consectetur libero id faucibus nisl. Enim blandit volutpat maecenas volutpat blandit.</p>\n<p>Malesuada bibendum arcu vitae elementum curabitur. Lectus proin nibh nisl condimentum id venenatis a. Porttitor leo a diam sollicitudin tempor id eu nisl. Nisi lacus sed viverra tellus. Phasellus faucibus scelerisque eleifend donec pretium. Lorem dolor sed viverra ipsum. Tincidunt vitae semper quis lectus nulla at volutpat diam. Eu tincidunt tortor aliquam nulla facilisi cras fermentum. Metus dictum at tempor commodo ullamcorper a. Nulla porttitor massa id neque aliquam vestibulum morbi blandit. Aliquam nulla facilisi cras fermentum odio. Morbi blandit cursus risus at ultrices mi tempus imperdiet. Sit amet nisl suscipit adipiscing bibendum est ultricies. Consectetur adipiscing elit pellentesque habitant. Magnis dis parturient montes nascetur ridiculus. Fermentum dui faucibus in ornare.</p>"
//                             }
//                           }
//                         },
//                         "settings": null
//                       }
//                     ]
//                   },
//                   "sidebar": null
//                 }
//               },
//               "settings": null
//             }
//           ]
//         },
//         "date": "2023-08-14T06:00:00Z",
//         "introduction": "Thousands of Coventry residents are more physically and mentally active thanks to two community-led initiatives that are helping to deliver the legacy from the Commonwealth Games.\n\nAndy Street, Mayor of the West Midlands and chair of the West Midlands Combined Authority (WMCA), has visited Coventry Moves and Guardian Ballers as part of a tour of the region one year on from the Games to see how communities are benefitting from last summer’s sporting spectacle.",
//         "image": [
//           {
//             "id": "bf9d6957-9b8b-43fc-ace8-26894ce4ec91",
//             "name": "Elsa Noblet 5Kd5pmzefcg Unsplash",
//             "mediaType": "Image",
//             "url": "/media/kfuj1p2l/elsa-noblet-5kd5pmzefcg-unsplash.jpg",
//             "extension": "",
//             "width": 0,
//             "height": 0,
//             "bytes": 0,
//             "properties": {},
//             "focalPoint": null,
//             "crops": [
//               {
//                 "alias": "Banner",
//                 "width": 3000,
//                 "height": 1500,
//                 "coordinates": null
//               },
//               {
//                 "alias": "Content Card - Square",
//                 "width": 300,
//                 "height": 300,
//                 "coordinates": null
//               }
//             ]
//           }
//         ],
//         "hideImageInBlog": false,
//         "tags": [
//           "Skills, education and careers",
//           "Life in the West Midlands",
//           "Equality and diversity"
//         ],
//         "author": [
//           {
//             "name": "Courtney Swift",
//             "createDate": "2023-08-09T12:26:33Z",
//             "updateDate": "2023-10-16T16:00:11.527Z",
//             "route": {
//               "path": "/authors/courtney-swift/",
//               "startItem": {
//                 "id": "68f3e929-d00c-48b7-b313-c89086636804",
//                 "path": "west-midlands-combined-authority"
//               }
//             },
//             "id": "9f250014-9e32-49ed-9d81-5a12169684fc",
//             "contentType": "author",
//             "properties": {}
//           }
//         ]
//       },
//       "cultures": {}
//     },
//     {
//       "name": "Why is economic growth important? And why is inclusive growth even more important?",
//       "createDate": "2023-08-08T10:16:20Z",
//       "updateDate": "2023-11-08T16:11:21.5Z",
//       "route": {
//         "path": "/blog/why-is-economic-growth-important-and-why-is-inclusive-growth-even-more-important/",
//         "startItem": {
//           "id": "68f3e929-d00c-48b7-b313-c89086636804",
//           "path": "west-midlands-combined-authority"
//         }
//       },
//       "id": "d85e3c6a-a2ac-46aa-8213-fb2cca5b1867",
//       "contentType": "blogArticle",
//       "properties": {
//         "grid": {
//           "items": [
//             {
//               "content": {
//                 "id": "3d558cd9-f7a3-4464-9d46-82d649e9052b",
//                 "contentType": "blogLayoutBlock",
//                 "properties": {
//                   "content": {
//                     "items": [
//                       {
//                         "content": {
//                           "id": "fdacce19-3fa2-42de-9ab5-0f875789154b",
//                           "contentType": "videoBlock",
//                           "properties": {
//                             "youtube": "ddui9PmSY58&t=1s"
//                           }
//                         },
//                         "settings": null
//                       },
//                       {
//                         "content": {
//                           "id": "6db6c53f-1bef-421d-b18d-77ba3e9ae097",
//                           "contentType": "textboxBlock",
//                           "properties": {
//                             "textbox": {
//                               "markup": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Blandit massa enim nec dui nunc. Condimentum lacinia quis vel eros donec ac odio. Sem et tortor consequat id porta nibh venenatis. Quis risus sed vulputate odio. Aliquam faucibus purus in massa tempor nec feugiat. Morbi tristique senectus et netus et malesuada fames. Diam sollicitudin tempor id eu nisl. Mauris sit amet massa vitae tortor condimentum. Volutpat maecenas volutpat blandit aliquam etiam erat velit. Fermentum posuere urna nec tincidunt. At augue eget arcu dictum varius duis at consectetur. Nibh nisl condimentum id venenatis a condimentum. Pellentesque elit eget gravida cum. Eget dolor morbi non arcu risus quis. Aliquet eget sit amet tellus cras adipiscing enim eu. Rutrum tellus pellentesque eu tincidunt tortor. Varius sit amet mattis vulputate enim nulla aliquet.</p>\n<p>Commodo sed egestas egestas fringilla phasellus faucibus scelerisque eleifend. Vulputate odio ut enim blandit volutpat maecenas volutpat blandit aliquam. Sollicitudin aliquam ultrices sagittis orci a scelerisque purus semper eget. Enim ut sem viverra aliquet. Felis donec et odio pellentesque. Nulla malesuada pellentesque elit eget gravida cum. Malesuada bibendum arcu vitae elementum curabitur. Tempor orci dapibus ultrices in iaculis nunc sed augue lacus. Fermentum et sollicitudin ac orci phasellus egestas. Neque laoreet suspendisse interdum consectetur libero id faucibus nisl. Enim blandit volutpat maecenas volutpat blandit.</p>\n<p>Malesuada bibendum arcu vitae elementum curabitur. Lectus proin nibh nisl condimentum id venenatis a. Porttitor leo a diam sollicitudin tempor id eu nisl. Nisi lacus sed viverra tellus. Phasellus faucibus scelerisque eleifend donec pretium. Lorem dolor sed viverra ipsum. Tincidunt vitae semper quis lectus nulla at volutpat diam. Eu tincidunt tortor aliquam nulla facilisi cras fermentum. Metus dictum at tempor commodo ullamcorper a. Nulla porttitor massa id neque aliquam vestibulum morbi blandit. Aliquam nulla facilisi cras fermentum odio. Morbi blandit cursus risus at ultrices mi tempus imperdiet. Sit amet nisl suscipit adipiscing bibendum est ultricies. Consectetur adipiscing elit pellentesque habitant. Magnis dis parturient montes nascetur ridiculus. Fermentum dui faucibus in ornare.</p>"
//                             }
//                           }
//                         },
//                         "settings": null
//                       },
//                       {
//                         "content": {
//                           "id": "3778f1fa-2296-4afb-89fc-39226316ed75",
//                           "contentType": "imageBlock",
//                           "properties": {
//                             "image": [
//                               {
//                                 "id": "75e4665a-6658-4078-84bd-0ab40f3cb84a",
//                                 "name": "IMG 6836",
//                                 "mediaType": "Image",
//                                 "url": "/media/lrtoi3ky/img_6836.jpeg",
//                                 "extension": "jpeg",
//                                 "width": 4752,
//                                 "height": 3168,
//                                 "bytes": 4091632,
//                                 "properties": {},
//                                 "focalPoint": null,
//                                 "crops": [
//                                   {
//                                     "alias": "Banner",
//                                     "width": 3000,
//                                     "height": 1500,
//                                     "coordinates": null
//                                   },
//                                   {
//                                     "alias": "Content Card - Square",
//                                     "width": 300,
//                                     "height": 300,
//                                     "coordinates": null
//                                   }
//                                 ]
//                               }
//                             ]
//                           }
//                         },
//                         "settings": null
//                       },
//                       {
//                         "content": {
//                           "id": "57939c74-cbad-4e99-be32-8c91410c1fdd",
//                           "contentType": "accordionBlock",
//                           "properties": {
//                             "accordionTitle": "This is a test",
//                             "accordionContent": {
//                               "markup": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>"
//                             }
//                           }
//                         },
//                         "settings": null
//                       },
//                       {
//                         "content": {
//                           "id": "e0834894-a92a-41da-969b-1c8c04da6cd4",
//                           "contentType": "accordionBlock",
//                           "properties": {
//                             "accordionTitle": "This is a test 2",
//                             "accordionContent": {
//                               "markup": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>"
//                             }
//                           }
//                         },
//                         "settings": null
//                       }
//                     ]
//                   },
//                   "sidebar": {
//                     "items": [
//                       {
//                         "content": {
//                           "id": "980ea679-f662-47e9-be01-ea196de8e2a2",
//                           "contentType": "contentCardBlock",
//                           "properties": {
//                             "image": [
//                               {
//                                 "id": "e4a6b27a-6a48-4c65-abe9-aae1eb190d45",
//                                 "name": "Untitled 2500 800Px",
//                                 "mediaType": "Image",
//                                 "url": "/media/pszknzci/untitled-2500-800px.png",
//                                 "extension": "png",
//                                 "width": 2500,
//                                 "height": 800,
//                                 "bytes": 4611301,
//                                 "properties": {},
//                                 "focalPoint": null,
//                                 "crops": [
//                                   {
//                                     "alias": "Banner",
//                                     "width": 3000,
//                                     "height": 1500,
//                                     "coordinates": null
//                                   },
//                                   {
//                                     "alias": "Content Card - Square",
//                                     "width": 300,
//                                     "height": 300,
//                                     "coordinates": null
//                                   }
//                                 ]
//                               }
//                             ],
//                             "title": "This is a test",
//                             "content": {
//                               "markup": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>"
//                             },
//                             "link": [
//                               {
//                                 "url": null,
//                                 "title": "Blog",
//                                 "target": null,
//                                 "destinationId": "c66668c7-dfd8-4362-8b7f-60d466b2846d",
//                                 "destinationType": "blog",
//                                 "route": {
//                                   "path": "/blog/",
//                                   "startItem": {
//                                     "id": "68f3e929-d00c-48b7-b313-c89086636804",
//                                     "path": "west-midlands-combined-authority"
//                                   }
//                                 },
//                                 "linkType": "Content"
//                               }
//                             ]
//                           }
//                         },
//                         "settings": null
//                       }
//                     ]
//                   }
//                 }
//               },
//               "settings": null
//             }
//           ]
//         },
//         "date": "2023-08-14T06:00:00Z",
//         "introduction": "Thousands of businesses will get help to cut their energy usage and bills and support the region’s transition to net zero under plans that will be presented to the West Midlands Combined Authority Board on Friday (15 September).",
//         "image": [
//           {
//             "id": "2ec4ad88-5b4c-4234-af2a-6354dd0cbdab",
//             "name": "Marten Bjork Rh8o0fhfpfw Unsplash",
//             "mediaType": "Image",
//             "url": "/media/r0wnilsm/marten-bjork-rh8o0fhfpfw-unsplash.jpg",
//             "extension": "",
//             "width": 0,
//             "height": 0,
//             "bytes": 0,
//             "properties": {},
//             "focalPoint": null,
//             "crops": [
//               {
//                 "alias": "Banner",
//                 "width": 3000,
//                 "height": 1500,
//                 "coordinates": null
//               },
//               {
//                 "alias": "Content Card - Square",
//                 "width": 300,
//                 "height": 300,
//                 "coordinates": null
//               }
//             ]
//           }
//         ],
//         "hideImageInBlog": false,
//         "tags": [
//           "Skills, education and careers",
//           "Life in the West Midlands",
//           "Equality and diversity"
//         ],
//         "author": [
//           {
//             "name": "Courtney Swift",
//             "createDate": "2023-08-09T12:26:33Z",
//             "updateDate": "2023-10-16T16:00:11.527Z",
//             "route": {
//               "path": "/authors/courtney-swift/",
//               "startItem": {
//                 "id": "68f3e929-d00c-48b7-b313-c89086636804",
//                 "path": "west-midlands-combined-authority"
//               }
//             },
//             "id": "9f250014-9e32-49ed-9d81-5a12169684fc",
//             "contentType": "author",
//             "properties": {}
//           }
//         ]
//       },
//       "cultures": {}
//     }
//   ]
// }


const getBlogArticles = async () => {

  const response = await fetch(getBlogEndPoint, {
    method: 'GET', // or 'POST' or other HTTP methods
    headers: {
      'Content-Type': 'application/json',
      'Api-Key': '54191bfa-d83f-4f8d-80ba-54587374b638',
    },
  });
  const parsedResponse = await response.json();
  // console.log(parsedResponse, 'parse')

  return parsedResponse;
};

export default getBlogArticles;
