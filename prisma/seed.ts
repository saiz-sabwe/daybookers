import db from "../lib/db";
import { auth } from "../lib/auth";
import { UserRole, HotelStatus, BookingStatus, PaymentStatus, PromotionType, PromotionScope } from "../lib/generated/prisma/client";

const prisma = db;

// Fonction helper pour créer un utilisateur avec Better Auth
async function createUserWithPassword(
  email: string,
  name: string,
  password: string,
  roles: UserRole[]
) {
  // Vérifier si l'utilisateur existe déjà
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    // Si l'utilisateur existe, mettre à jour les rôles
    const updatedUser = await prisma.user.update({
      where: { id: existingUser.id },
      data: { roles },
    });
    return updatedUser;
  }

  // Utiliser l'API Better Auth pour créer l'utilisateur
  try {
    const result = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
    });

    const userId = result.user?.id;
    if (!userId) {
      // Si l'API ne retourne pas l'ID, récupérer depuis la base
      const user = await prisma.user.findUnique({
        where: { email },
      });
      if (!user) {
        throw new Error("User created but ID not found");
      }
      // Mettre à jour les rôles
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { roles },
      });
      return updatedUser;
    }

    // Mettre à jour les rôles
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { roles },
    });

    return updatedUser;
  } catch (error) {
    // Si l'erreur vient d'un utilisateur existant, récupérer et mettre à jour
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (user) {
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { roles },
      });
      return updatedUser;
    }
    throw error;
  }
}

async function main() {
  console.log("🌱 Starting database seeding...");

  // 1. Créer la ville (slug est unique)
  const city = await prisma.city.upsert({
    where: { slug: "kinshasa" },
    update: {},
    create: {
      name: "Kinshasa",
      slug: "kinshasa",
      country: "RD Congo",
      countryCode: "CD",
      latitude: -4.3276,
      longitude: 15.3136,
    },
  });
  console.log("✅ City created:", city.name);

  // 2. Créer les TimeSlots (pas de contrainte unique sur name, donc on vérifie avant de créer)
  const timeSlotData = [
    { name: "Matin", startTime: "09:00", endTime: "13:00", description: "Créneau matinal" },
    { name: "Après-midi", startTime: "12:00", endTime: "17:00", description: "Créneau après-midi" },
    { name: "Journée", startTime: "10:00", endTime: "18:00", description: "Journée complète" },
  ];

  const timeSlots = [];
  for (const slotData of timeSlotData) {
    let timeSlot = await prisma.timeSlot.findFirst({
      where: { name: slotData.name },
    });
    if (!timeSlot) {
      timeSlot = await prisma.timeSlot.create({
        data: slotData,
      });
    }
    timeSlots.push(timeSlot);
  }
  console.log("✅ TimeSlots created:", timeSlots.length);

  // 3. Créer les Amenities (name est unique)
  const amenityData = [
    { name: "WiFi Gratuit", category: "hotel", icon: "wifi" },
    { name: "Piscine", category: "hotel", icon: "pool" },
    { name: "Spa", category: "hotel", icon: "spa" },
    { name: "Parking", category: "hotel", icon: "parking" },
    { name: "Restaurant", category: "hotel", icon: "restaurant" },
    { name: "Salle de sport", category: "hotel", icon: "gym" },
    { name: "Climatisation", category: "room", icon: "ac" },
    { name: "TV", category: "room", icon: "tv" },
    { name: "Mini-bar", category: "room", icon: "minibar" },
  ];

  const amenities = await Promise.all(
    amenityData.map((data) =>
      prisma.amenity.upsert({
        where: { name: data.name },
        update: {},
        create: data,
      })
    )
  );
  console.log("✅ Amenities created:", amenities.length);

  // 4. Créer les utilisateurs avec différents rôles
  const password = "12345678";

  // Users avec ROLE_USER (2)
  const users = await Promise.all([
    createUserWithPassword("user1@example.com", "Jean Dupont", password, [UserRole.ROLE_USER]),
    createUserWithPassword("user2@example.com", "Marie Martin", password, [UserRole.ROLE_USER]),
  ]);

  // Users avec ROLE_USER + ROLE_SUBSCRIBER (2)
  const subscribers = await Promise.all([
    createUserWithPassword("subscriber1@example.com", "Pierre Dubois", password, [UserRole.ROLE_USER, UserRole.ROLE_SUBSCRIBER]),
    createUserWithPassword("subscriber2@example.com", "Sophie Bernard", password, [UserRole.ROLE_USER, UserRole.ROLE_SUBSCRIBER]),
  ]);

  // Users avec ROLE_HOTEL_GROUP_MANAGER (2)
  const groupManagers = await Promise.all([
    createUserWithPassword("groupmanager1@example.com", "Manager Groupe 1", password, [UserRole.ROLE_USER, UserRole.ROLE_HOTEL_GROUP_MANAGER]),
    createUserWithPassword("groupmanager2@example.com", "Manager Groupe 2", password, [UserRole.ROLE_USER, UserRole.ROLE_HOTEL_GROUP_MANAGER]),
  ]);

  // Users avec ROLE_HOTEL_MANAGER (2)
  const hotelManagers = await Promise.all([
    createUserWithPassword("hotelmanager1@example.com", "Manager Hôtel 1", password, [UserRole.ROLE_USER, UserRole.ROLE_HOTEL_MANAGER]),
    createUserWithPassword("hotelmanager2@example.com", "Manager Hôtel 2", password, [UserRole.ROLE_USER, UserRole.ROLE_HOTEL_MANAGER]),
  ]);

  // Users avec ROLE_HOTEL_RECEPTIONIST (2)
  const receptionists = await Promise.all([
    createUserWithPassword("receptionist1@example.com", "Réceptionniste 1", password, [UserRole.ROLE_USER, UserRole.ROLE_HOTEL_RECEPTIONIST]),
    createUserWithPassword("receptionist2@example.com", "Réceptionniste 2", password, [UserRole.ROLE_USER, UserRole.ROLE_HOTEL_RECEPTIONIST]),
  ]);

  // Users avec ROLE_ADMIN (2)
  const admins = await Promise.all([
    createUserWithPassword("admin1@example.com", "Admin 1", password, [UserRole.ROLE_USER, UserRole.ROLE_ADMIN]),
    createUserWithPassword("admin2@example.com", "Admin 2", password, [UserRole.ROLE_USER, UserRole.ROLE_ADMIN]),
  ]);

  // Users avec ROLE_SUPER_ADMIN (2)
  const superAdmins = await Promise.all([
    createUserWithPassword("superadmin1@example.com", "Super Admin 1", password, [UserRole.ROLE_USER, UserRole.ROLE_SUPER_ADMIN]),
    createUserWithPassword("superadmin2@example.com", "Super Admin 2", password, [UserRole.ROLE_USER, UserRole.ROLE_SUPER_ADMIN]),
  ]);

  console.log("✅ Users created:");
  console.log(`   - ${users.length} ROLE_USER`);
  console.log(`   - ${subscribers.length} ROLE_USER + ROLE_SUBSCRIBER`);
  console.log(`   - ${groupManagers.length} ROLE_HOTEL_GROUP_MANAGER`);
  console.log(`   - ${hotelManagers.length} ROLE_HOTEL_MANAGER`);
  console.log(`   - ${receptionists.length} ROLE_HOTEL_RECEPTIONIST`);
  console.log(`   - ${admins.length} ROLE_ADMIN`);
  console.log(`   - ${superAdmins.length} ROLE_SUPER_ADMIN`);

  // 5. Créer 4 partenaires (utiliser les 4 premiers hotelManagers, ajouter 2 supplémentaires si nécessaire)
  const additionalManagers = await Promise.all([
    createUserWithPassword("hotelmanager3@example.com", "Manager Hôtel 3", password, [UserRole.ROLE_USER, UserRole.ROLE_HOTEL_MANAGER]),
    createUserWithPassword("hotelmanager4@example.com", "Manager Hôtel 4", password, [UserRole.ROLE_USER, UserRole.ROLE_HOTEL_MANAGER]),
  ]);
  const allManagers = [...hotelManagers, ...additionalManagers];
  const partners = allManagers.slice(0, 4);

  // Créer PartnerSettings pour chaque partenaire (partnerId est unique)
  for (const partner of partners) {
    await prisma.partnerSettings.upsert({
      where: { partnerId: partner.id },
      update: {},
      create: {
        partnerId: partner.id,
        commissionRate: 0.15,
        payoutMethod: "bank_transfer",
        payoutSchedule: "monthly",
        autoConfirm: false,
        emailNotifications: true,
        smsNotifications: false,
      },
    });
  }
  console.log("✅ Partners created:", partners.length);

  // 6. Créer des hôtels pour chaque partenaire (1-4 par partenaire, max 16 total)
  const allHotels = [];
  const hotelNames = [
    "Hôtel Pullman Kinshasa",
    "Grand Hôtel Kinshasa",
    "Hotel Memling",
    "Fleuve Congo Hôtel",
    "Hotel Sultani",
    "Hotel Royal",
    "Hotel Kinshasa Plaza",
    "Hotel Okapi",
    "Hotel Victoire",
    "Hotel Karavia",
    "Hotel Beatrice",
    "Hotel Regina",
    "Hotel Continental",
    "Hotel Safari",
    "Hotel Riviera",
    "Hotel Paradise",
  ];

  let hotelIndex = 0;
  for (const partner of partners) {
    const hotelCount = Math.floor(Math.random() * 4) + 1; // 1 à 4 hôtels
    const partnerHotels = [];

    for (let i = 0; i < hotelCount && hotelIndex < hotelNames.length; i++) {
      const hotelName = hotelNames[hotelIndex];
      const hotelSlug = hotelName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      const stars = Math.floor(Math.random() * 4) + 2; // 2 à 5 étoiles

      const hotel = await prisma.hotel.upsert({
        where: { slug: `${hotelSlug}-${hotelIndex + 1}` },
        update: {},
        create: {
          name: hotelName,
          slug: `${hotelSlug}-${hotelIndex + 1}`,
          description: `Description de ${hotelName}. Un hôtel confortable au cœur de Kinshasa.`,
          address: `Adresse ${hotelIndex + 1}, Kinshasa`,
          cityId: city.id,
          stars,
          status: HotelStatus.ACTIVE,
          latitude: -4.3276 + (Math.random() - 0.5) * 0.1,
          longitude: 15.3136 + (Math.random() - 0.5) * 0.1,
          phone: `+243 900 000 ${String(hotelIndex + 1).padStart(3, "0")}`,
          email: `contact@${hotelSlug}.cd`,
          images: [
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
            "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
          ],
        },
      });

      // Assigner le partenaire comme manager de l'hôtel (userId + hotelId est unique)
      const existingManager = await prisma.hotelManager.findFirst({
        where: {
          userId: partner.id,
          hotelId: hotel.id,
        },
      });
      if (!existingManager) {
        await prisma.hotelManager.create({
          data: {
            userId: partner.id,
            hotelId: hotel.id,
          },
        });
      }

      partnerHotels.push(hotel);
      allHotels.push(hotel);
      hotelIndex++;
    }

    console.log(`✅ Created ${partnerHotels.length} hotels for partner ${partner.name}`);
  }

  console.log(`✅ Total hotels created: ${allHotels.length}`);

  // 7. Créer des RoomTypes pour chaque hôtel
  const allRoomTypes = [];
  const roomTypeNames = ["Chambre Standard", "Chambre Deluxe", "Suite", "Suite Présidentielle"];

  for (const hotel of allHotels) {
    const roomTypeCount = Math.floor(Math.random() * 3) + 1; // 1 à 3 types de chambres
    const hotelRoomTypes = [];

    for (let i = 0; i < roomTypeCount; i++) {
      const roomTypeName = roomTypeNames[i] || `Chambre Type ${i + 1}`;
      const basePrice = Math.floor(Math.random() * 100) + 40; // 40 à 140 USD

      const roomType = await prisma.roomType.create({
        data: {
          hotelId: hotel.id,
          name: roomTypeName,
          description: `${roomTypeName} de l'${hotel.name}`,
          maxGuests: Math.floor(Math.random() * 3) + 1, // 1 à 3
          basePrice,
          currency: "USD",
          images: [
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
          ],
        },
      });

      hotelRoomTypes.push(roomType);
      allRoomTypes.push(roomType);
    }

    // Ajouter des HotelAmenities (hotelId + amenityId est unique)
    const hotelAmenities = amenities.filter((a) => a.category === "hotel").slice(0, Math.floor(Math.random() * 4) + 2);
    for (const amenity of hotelAmenities) {
      const existing = await prisma.hotelAmenity.findFirst({
        where: {
          hotelId: hotel.id,
          amenityId: amenity.id,
        },
      });
      if (!existing) {
        await prisma.hotelAmenity.create({
          data: {
            hotelId: hotel.id,
            amenityId: amenity.id,
          },
        });
      }
    }

    // Ajouter des RoomAmenities pour chaque RoomType (roomTypeId + amenityId est unique)
    const roomAmenities = amenities.filter((a) => a.category === "room");
    for (const roomType of hotelRoomTypes) {
      const selectedAmenities = roomAmenities.slice(0, Math.floor(Math.random() * roomAmenities.length) + 1);
      for (const amenity of selectedAmenities) {
        const existing = await prisma.roomAmenity.findFirst({
          where: {
            roomTypeId: roomType.id,
            amenityId: amenity.id,
          },
        });
        if (!existing) {
          await prisma.roomAmenity.create({
            data: {
              roomTypeId: roomType.id,
              amenityId: amenity.id,
            },
          });
        }
      }
    }
  }

  console.log(`✅ RoomTypes created: ${allRoomTypes.length}`);

  // 8. Créer des Availabilities pour les prochains 30 jours (roomTypeId + timeSlotId + date est unique)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let availabilityCount = 0;

  for (const roomType of allRoomTypes) {
    for (const timeSlot of timeSlots) {
      for (let day = 0; day < 30; day++) {
        const date = new Date(today);
        date.setDate(date.getDate() + day);

        // 80% de chance d'être disponible
        const available = Math.random() > 0.2;
        const price = available ? roomType.basePrice * (0.9 + Math.random() * 0.2) : null;

        const existing = await prisma.availability.findFirst({
          where: {
            roomTypeId: roomType.id,
            timeSlotId: timeSlot.id,
            date,
          },
        });
        if (!existing) {
          await prisma.availability.create({
            data: {
              roomTypeId: roomType.id,
              timeSlotId: timeSlot.id,
              date,
              available,
              price: price || undefined,
            },
          });
        }

        availabilityCount++;
      }
    }
  }

  console.log(`✅ Availabilities created: ${availabilityCount}`);

  // 9. Créer des Bookings
  const bookingStatuses: BookingStatus[] = [
    BookingStatus.PENDING,
    BookingStatus.CONFIRMED,
    BookingStatus.CANCELLED,
    BookingStatus.COMPLETED,
  ];

  const bookings = [];
  const allUsers = [...users, ...subscribers];
  for (let i = 0; i < 25; i++) {
    const user = allUsers[Math.floor(Math.random() * allUsers.length)];
    const hotel = allHotels[Math.floor(Math.random() * allHotels.length)];
    const hotelRoomTypes = allRoomTypes.filter((rt) => rt.hotelId === hotel.id);
    if (hotelRoomTypes.length === 0) continue;

    const roomType = hotelRoomTypes[Math.floor(Math.random() * hotelRoomTypes.length)];
    const timeSlot = timeSlots[Math.floor(Math.random() * timeSlots.length)];
    const status = bookingStatuses[Math.floor(Math.random() * bookingStatuses.length)];

    const bookingDate = new Date(today);
    bookingDate.setDate(bookingDate.getDate() + Math.floor(Math.random() * 30) - 5); // -5 à +25 jours

    const originalPrice = roomType.basePrice;
    const discountAmount = Math.random() > 0.7 ? originalPrice * 0.1 : 0;
    const finalPrice = originalPrice - discountAmount;

    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        hotelId: hotel.id,
        roomTypeId: roomType.id,
        date: bookingDate,
        timeSlotId: timeSlot.id,
        guestCount: Math.floor(Math.random() * 3) + 1,
        status,
        originalPrice,
        discountAmount,
        finalPrice,
        currency: "USD",
        guestName: user.name,
        guestEmail: user.email,
        guestPhone: `+243 900 000 ${String(i + 1).padStart(3, "0")}`,
      },
    });

    bookings.push(booking);

    // Créer un Payment si la réservation est confirmée ou complétée (bookingId est unique)
    if (status === BookingStatus.CONFIRMED || status === BookingStatus.COMPLETED) {
      await prisma.payment.upsert({
        where: { bookingId: booking.id },
        update: {},
        create: {
          bookingId: booking.id,
          amount: finalPrice,
          currency: "USD",
          status: status === BookingStatus.COMPLETED ? PaymentStatus.COMPLETED : PaymentStatus.PENDING,
          method: "cash",
          transactionId: `TXN-${booking.id}`,
          paidAt: status === BookingStatus.COMPLETED ? new Date() : null,
        },
      });
    }
  }

  console.log(`✅ Bookings created: ${bookings.length}`);

  // 10. Créer des Reviews pour les bookings complétées (bookingId est unique)
  const completedBookings = bookings.filter((b) => b.status === BookingStatus.COMPLETED);
  for (const booking of completedBookings.slice(0, 10)) {
    const hotel = allHotels.find((h) => h.id === booking.hotelId);
    if (!hotel) continue;

    await prisma.review.upsert({
      where: { bookingId: booking.id },
      update: {},
      create: {
        userId: booking.userId,
        hotelId: booking.hotelId,
        bookingId: booking.id,
        rating: Math.floor(Math.random() * 3) + 3, // 3 à 5
        title: `Avis sur ${hotel.name}`,
        comment: "Très bon séjour, je recommande !",
        verified: true,
        helpful: Math.floor(Math.random() * 10),
      },
    });
  }

  console.log(`✅ Reviews created: ${completedBookings.length}`);

  // 11. Créer des Favorites (userId + hotelId est unique)
  for (const user of [...users, ...subscribers]) {
    const favoriteCount = Math.floor(Math.random() * 3) + 1;
    const favoriteHotels = allHotels
      .sort(() => Math.random() - 0.5)
      .slice(0, favoriteCount);

    for (const hotel of favoriteHotels) {
      const existing = await prisma.favorite.findFirst({
        where: {
          userId: user.id,
          hotelId: hotel.id,
        },
      });
      if (!existing) {
        await prisma.favorite.create({
          data: {
            userId: user.id,
            hotelId: hotel.id,
          },
        });
      }
    }
  }

  console.log("✅ Favorites created");

  // 12. Créer des Promotions (code est unique)
  const promotions = await Promise.all([
    prisma.promotion.upsert({
      where: { code: "WELCOME10" },
      update: {},
      create: {
        code: "WELCOME10",
        name: "Bienvenue -10%",
        description: "Réduction de 10% pour les nouveaux clients",
        type: PromotionType.PERCENTAGE,
        value: 10,
        scope: PromotionScope.GLOBAL,
        maxUses: 100,
        maxUsesPerUser: 1,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 jours
        active: true,
      },
    }),
    prisma.promotion.upsert({
      where: { code: "WEEKEND20" },
      update: {},
      create: {
        code: "WEEKEND20",
        name: "Week-end -20%",
        description: "Réduction de 20% pour les réservations du week-end",
        type: PromotionType.PERCENTAGE,
        value: 20,
        scope: PromotionScope.GLOBAL,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 180 jours
        active: true,
      },
    }),
  ]);

  console.log(`✅ Promotions created: ${promotions.length}`);

  // 13. Créer des CancellationPolicies (pas de contrainte unique, mais on peut éviter les doublons en vérifiant)
  for (const hotel of allHotels.slice(0, 5)) {
    const existingPolicy = await prisma.cancellationPolicy.findFirst({
      where: { hotelId: hotel.id },
    });
    if (!existingPolicy) {
      await prisma.cancellationPolicy.create({
        data: {
          hotelId: hotel.id,
          name: "Annulation gratuite",
          description: "Annulation gratuite jusqu'à 24h avant",
          freeCancellationUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
          cancellationFee: 0,
          active: true,
        },
      });
    }
  }

  console.log("✅ CancellationPolicies created");

  // 14. Mettre à jour hotelCount dans City
  await prisma.city.update({
    where: { id: city.id },
    data: { hotelCount: allHotels.length },
  });

  console.log("✅ City hotelCount updated");

  console.log("\n🎉 Seeding completed successfully!");
  console.log("\n📊 Summary:");
  console.log(`   - ${users.length + subscribers.length + groupManagers.length + allManagers.length + receptionists.length + admins.length + superAdmins.length} Users`);
  console.log(`   - ${partners.length} Partners`);
  console.log(`   - ${allHotels.length} Hotels`);
  console.log(`   - ${allRoomTypes.length} RoomTypes`);
  console.log(`   - ${availabilityCount} Availabilities`);
  console.log(`   - ${bookings.length} Bookings`);
  console.log(`   - ${completedBookings.length} Reviews`);
  console.log(`   - ${promotions.length} Promotions`);
  console.log("\n🔑 All users password: 12345678");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
