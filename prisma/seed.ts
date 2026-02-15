import db from "../lib/db";
import { auth } from "../lib/auth";
import { UserRole, HotelStatus, BookingStatus, PaymentStatus, PromotionType, PromotionScope, ComplaintStatus, ComplaintPriority, NotificationType, NotificationChannel, PricingRuleType, ActivityType } from "../lib/generated/prisma/client";

const prisma = db;

// Fonction helper pour créer un utilisateur avec Better Auth
async function createUserWithPassword(
  email: string,
  name: string,
  password: string,
  roles: UserRole[],
  phone?: string
) {
  // Vérifier si l'utilisateur existe déjà
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    // Si l'utilisateur existe, mettre à jour les rôles et le téléphone
    const updatedUser = await prisma.user.update({
      where: { id: existingUser.id },
      data: { roles, phone },
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
      // Mettre à jour les rôles et le téléphone
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { roles, phone },
      });
      return updatedUser;
    }

    // Mettre à jour les rôles et le téléphone
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { roles, phone },
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
        data: { roles, phone },
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

  // 2. Créer les TimeSlots avec IDs fixes correspondant à la migration
  const timeSlotData = [
    { id: "timeslot_morning", name: "Matin", startTime: "08:00", endTime: "12:00", description: "Créneau matinal de 8h à 12h" },
    { id: "timeslot_afternoon", name: "Après-midi", startTime: "12:00", endTime: "17:00", description: "Créneau après-midi de 12h à 17h" },
    { id: "timeslot_fullday", name: "Journée", startTime: "08:00", endTime: "17:00", description: "Créneau journée complète de 8h à 17h" },
    { id: "timeslot_classic", name: "Location classique", startTime: "12:00", endTime: "12:00", description: "Location de 12h à 12h le lendemain (24h)" },
  ];

  const timeSlots = [];
  for (const slotData of timeSlotData) {
    // Utiliser upsert avec l'ID fixe
    const timeSlot = await prisma.timeSlot.upsert({
      where: { id: slotData.id },
      update: {
        name: slotData.name,
        startTime: slotData.startTime,
        endTime: slotData.endTime,
        description: slotData.description,
      },
      create: slotData,
    });
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

  // 4. Créer les utilisateurs avec différents rôles et numéros de téléphone
  const password = "12345678";

  // Users avec ROLE_USER (2)
  const users = await Promise.all([
    createUserWithPassword("user1@example.com", "Jean Dupont", password, [UserRole.ROLE_USER], "+243 900 111 001"),
    createUserWithPassword("user2@example.com", "Marie Martin", password, [UserRole.ROLE_USER], "+243 900 111 002"),
  ]);

  // Users avec ROLE_USER + ROLE_SUBSCRIBER (2)
  const subscribers = await Promise.all([
    createUserWithPassword("subscriber1@example.com", "Pierre Dubois", password, [UserRole.ROLE_USER, UserRole.ROLE_SUBSCRIBER], "+243 900 222 001"),
    createUserWithPassword("subscriber2@example.com", "Sophie Bernard", password, [UserRole.ROLE_USER, UserRole.ROLE_SUBSCRIBER], "+243 900 222 002"),
  ]);

  // Users avec ROLE_HOTEL_GROUP_MANAGER (2)
  const groupManagers = await Promise.all([
    createUserWithPassword("groupmanager1@example.com", "Manager Groupe 1", password, [UserRole.ROLE_USER, UserRole.ROLE_HOTEL_GROUP_MANAGER], "+243 900 333 001"),
    createUserWithPassword("groupmanager2@example.com", "Manager Groupe 2", password, [UserRole.ROLE_USER, UserRole.ROLE_HOTEL_GROUP_MANAGER], "+243 900 333 002"),
  ]);

  // Users avec ROLE_HOTEL_MANAGER (2)
  const hotelManagers = await Promise.all([
    createUserWithPassword("hotelmanager1@example.com", "Manager Hôtel 1", password, [UserRole.ROLE_USER, UserRole.ROLE_HOTEL_MANAGER], "+243 900 444 001"),
    createUserWithPassword("hotelmanager2@example.com", "Manager Hôtel 2", password, [UserRole.ROLE_USER, UserRole.ROLE_HOTEL_MANAGER], "+243 900 444 002"),
  ]);

  // Users avec ROLE_HOTEL_RECEPTIONIST (2)
  const receptionists = await Promise.all([
    createUserWithPassword("receptionist1@example.com", "Réceptionniste 1", password, [UserRole.ROLE_USER, UserRole.ROLE_HOTEL_RECEPTIONIST], "+243 900 555 001"),
    createUserWithPassword("receptionist2@example.com", "Réceptionniste 2", password, [UserRole.ROLE_USER, UserRole.ROLE_HOTEL_RECEPTIONIST], "+243 900 555 002"),
  ]);

  // Users avec ROLE_ADMIN (2)
  const admins = await Promise.all([
    createUserWithPassword("admin1@example.com", "Admin 1", password, [UserRole.ROLE_USER, UserRole.ROLE_ADMIN], "+243 900 666 001"),
    createUserWithPassword("admin2@example.com", "Admin 2", password, [UserRole.ROLE_USER, UserRole.ROLE_ADMIN], "+243 900 666 002"),
  ]);

  // Users avec ROLE_SUPER_ADMIN (2)
  const superAdmins = await Promise.all([
    createUserWithPassword("superadmin1@example.com", "Super Admin 1", password, [UserRole.ROLE_USER, UserRole.ROLE_SUPER_ADMIN], "+243 900 777 001"),
    createUserWithPassword("superadmin2@example.com", "Super Admin 2", password, [UserRole.ROLE_USER, UserRole.ROLE_SUPER_ADMIN], "+243 900 777 002"),
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
    createUserWithPassword("hotelmanager3@example.com", "Manager Hôtel 3", password, [UserRole.ROLE_USER, UserRole.ROLE_HOTEL_MANAGER], "+243 900 444 003"),
    createUserWithPassword("hotelmanager4@example.com", "Manager Hôtel 4", password, [UserRole.ROLE_USER, UserRole.ROLE_HOTEL_MANAGER], "+243 900 444 004"),
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

  // 5.5. Créer des HotelGroups (chaînes hôtelières)
  const hotelGroupData = [
    { name: "Pullman Hotels Group", slug: "pullman-hotels-group", description: "Chaîne internationale de luxe", logo: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200" },
    { name: "Congo Luxury Hotels", slug: "congo-luxury-hotels", description: "Hôtels de luxe en RD Congo", logo: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=200" },
    { name: "Kinshasa Grand Hotels", slug: "kinshasa-grand-hotels", description: "Réseau d'hôtels à Kinshasa", logo: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=200" },
  ];

  const hotelGroups = await Promise.all(
    hotelGroupData.map((data) =>
      prisma.hotelGroup.upsert({
        where: { slug: data.slug },
        update: {},
        create: data,
      })
    )
  );
  console.log("✅ Hotel Groups created:", hotelGroups.length);

  // 5.6. Assigner les HotelGroupManagers aux groupes
  // Chaque groupe doit avoir au moins un manager
  const groupManagerAssignments = [];
  
  // Assigner chaque groupManager à un groupe (1:1)
  for (let i = 0; i < groupManagers.length && i < hotelGroups.length; i++) {
    const existingAssignment = await prisma.hotelGroupManager.findFirst({
      where: {
        userId: groupManagers[i].id,
        groupId: hotelGroups[i].id,
      },
    });

    if (!existingAssignment) {
      const assignment = await prisma.hotelGroupManager.create({
        data: {
          userId: groupManagers[i].id,
          groupId: hotelGroups[i].id,
        },
      });
      groupManagerAssignments.push(assignment);
    } else {
      groupManagerAssignments.push(existingAssignment);
    }
  }
  
  // Si il reste des groupes sans manager, assigner le premier groupManager comme manager secondaire
  if (hotelGroups.length > groupManagers.length) {
    for (let i = groupManagers.length; i < hotelGroups.length; i++) {
      const existingAssignment = await prisma.hotelGroupManager.findFirst({
        where: {
          userId: groupManagers[0].id,
          groupId: hotelGroups[i].id,
        },
      });

      if (!existingAssignment) {
        const assignment = await prisma.hotelGroupManager.create({
          data: {
            userId: groupManagers[0].id,
            groupId: hotelGroups[i].id,
          },
        });
        groupManagerAssignments.push(assignment);
      } else {
        groupManagerAssignments.push(existingAssignment);
      }
    }
  }
  
  console.log("✅ Hotel Group Manager assignments created:", groupManagerAssignments.length);

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
      
      // 60% des hôtels appartiennent à un groupe
      const belongsToGroup = Math.random() < 0.6;
      const groupId = belongsToGroup && hotelGroups.length > 0 
        ? hotelGroups[Math.floor(Math.random() * hotelGroups.length)].id 
        : null;

      const hotel = await prisma.hotel.upsert({
        where: { slug: `${hotelSlug}-${hotelIndex + 1}` },
        update: {},
        create: {
          name: hotelName,
          slug: `${hotelSlug}-${hotelIndex + 1}`,
          description: `Description de ${hotelName}. Un hôtel confortable au cœur de Kinshasa.`,
          address: `Adresse ${hotelIndex + 1}, Kinshasa`,
          cityId: city.id,
          groupId,
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

  // 6.5. Assigner les réceptionnistes aux hôtels
  let receptionistAssignmentCount = 0;
  for (const receptionist of receptionists) {
    // Assigner chaque réceptionniste à 2-3 hôtels aléatoires
    const hotelsToAssign = Math.floor(Math.random() * 2) + 2; // 2 ou 3 hôtels
    const shuffledHotels = [...allHotels].sort(() => Math.random() - 0.5);
    const assignedHotels = shuffledHotels.slice(0, hotelsToAssign);

    for (const hotel of assignedHotels) {
      const existingAssignment = await prisma.hotelReceptionist.findFirst({
        where: {
          userId: receptionist.id,
          hotelId: hotel.id,
        },
      });

      if (!existingAssignment) {
        await prisma.hotelReceptionist.create({
          data: {
            userId: receptionist.id,
            hotelId: hotel.id,
          },
        });
        receptionistAssignmentCount++;
      }
    }
  }
  console.log(`✅ Receptionist assignments created: ${receptionistAssignmentCount}`);

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

  // 7.5. Créer des RoomOptions pour chaque RoomType
  const roomOptionTemplates = [
    { name: "Petit-déjeuner inclus", description: "Petit-déjeuner buffet continental", price: 15, required: false },
    { name: "Parking", description: "Place de parking sécurisée", price: 5, required: false },
    { name: "WiFi Premium", description: "Connexion WiFi haut débit", price: 3, required: false },
    { name: "Late Check-out", description: "Départ tardif jusqu'à 16h", price: 20, required: false },
  ];

  let roomOptionCount = 0;
  for (const roomType of allRoomTypes) {
    // Chaque RoomType a 1-3 options disponibles
    const optionCount = Math.floor(Math.random() * 3) + 1;
    const selectedTemplates = roomOptionTemplates.sort(() => Math.random() - 0.5).slice(0, optionCount);

    for (const template of selectedTemplates) {
      await prisma.roomOption.create({
        data: {
          roomTypeId: roomType.id,
          name: template.name,
          description: template.description,
          price: template.price,
          currency: "USD",
          required: template.required,
        },
      });
      roomOptionCount++;
    }
  }
  console.log(`✅ Room Options created: ${roomOptionCount}`);

  // 7.6. Créer des PricingRules (règles de tarification dynamique)
  let pricingRuleCount = 0;
  
  // Règles globales pour certains hôtels
  for (const hotel of allHotels.slice(0, 6)) {
    // Règle week-end (+20%)
    await prisma.pricingRule.create({
      data: {
        hotelId: hotel.id,
        name: "Supplément Week-end",
        type: PricingRuleType.WEEKEND,
        description: "Majoration de 20% pour les week-ends",
        multiplier: 1.2,
        dayOfWeek: [5, 6], // Vendredi, Samedi
        priority: 10,
        active: true,
      },
    });
    pricingRuleCount++;

    // Règle haute saison (Décembre-Janvier)
    await prisma.pricingRule.create({
      data: {
        hotelId: hotel.id,
        name: "Haute Saison",
        type: PricingRuleType.SEASON,
        description: "Majoration de 30% en haute saison",
        multiplier: 1.3,
        startDate: new Date(new Date().getFullYear(), 11, 1), // 1er Décembre
        endDate: new Date(new Date().getFullYear() + 1, 0, 31), // 31 Janvier
        priority: 5,
        active: true,
      },
    });
    pricingRuleCount++;
  }

  // Règles spécifiques par RoomType (Last minute)
  for (const roomType of allRoomTypes.slice(0, 10)) {
    await prisma.pricingRule.create({
      data: {
        roomTypeId: roomType.id,
        name: "Last Minute",
        type: PricingRuleType.LAST_MINUTE,
        description: "Réduction de 15% pour réservation dans les 24h",
        percentage: -15,
        maxDaysAdvance: 1,
        priority: 15,
        active: true,
      },
    });
    pricingRuleCount++;
  }

  console.log(`✅ Pricing Rules created: ${pricingRuleCount}`);

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

  // 9.5. Créer des BookingOptions pour certaines réservations
  let bookingOptionCount = 0;
  for (const booking of bookings) {
    // 60% des réservations ont des options
    if (Math.random() < 0.6) {
      const roomType = allRoomTypes.find(rt => rt.id === booking.roomTypeId);
      if (!roomType) continue;

      // Récupérer les options disponibles pour ce type de chambre
      const availableOptions = await prisma.roomOption.findMany({
        where: { roomTypeId: roomType.id },
      });

      if (availableOptions.length === 0) continue;

      // Sélectionner 1-2 options aléatoires
      const optionCount = Math.floor(Math.random() * 2) + 1;
      const selectedOptions = availableOptions.sort(() => Math.random() - 0.5).slice(0, optionCount);

      for (const option of selectedOptions) {
        const existing = await prisma.bookingOption.findFirst({
          where: {
            bookingId: booking.id,
            optionId: option.id,
          },
        });

        if (!existing) {
          await prisma.bookingOption.create({
            data: {
              bookingId: booking.id,
              optionId: option.id,
              quantity: 1,
              price: option.price,
            },
          });
          bookingOptionCount++;
        }
      }
    }
  }
  console.log(`✅ Booking Options created: ${bookingOptionCount}`);

  // 10. Créer des Reviews pour les bookings complétées (bookingId est unique)
  const completedBookings = bookings.filter((b) => b.status === BookingStatus.COMPLETED);
  let reviewCount = 0;
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
    reviewCount++;
  }

  console.log(`✅ Reviews created: ${reviewCount}`);

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

  // 12.5. Créer des PromotionUsage pour certaines réservations
  let promotionUsageCount = 0;
  for (const booking of bookings.slice(0, 8)) {
    // 30% des réservations utilisent une promotion
    if (Math.random() < 0.3 && promotions.length > 0) {
      const promotion = promotions[Math.floor(Math.random() * promotions.length)];
      
      const existing = await prisma.promotionUsage.findFirst({
        where: {
          promotionId: promotion.id,
          bookingId: booking.id,
        },
      });

      if (!existing) {
        await prisma.promotionUsage.create({
          data: {
            promotionId: promotion.id,
            userId: booking.userId,
            bookingId: booking.id,
            discountAmount: booking.discountAmount,
          },
        });
        promotionUsageCount++;
      }
    }
  }
  console.log(`✅ Promotion Usage created: ${promotionUsageCount}`);

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

  // 13.5. Créer des Plaintes (Complaints)
  const complaintTitles = [
    "Problème de climatisation dans la chambre",
    "Bruit excessif pendant la nuit",
    "Chambre pas conforme à la description",
    "Personnel impoli à la réception",
    "Problème de propreté",
    "WiFi non fonctionnel",
    "Eau chaude indisponible",
    "Équipements de la salle de bain défectueux",
    "Service de chambre trop lent",
    "Parking complet malgré la réservation",
    "Piscine fermée sans préavis",
    "Restaurant de l'hôtel fermé",
    "Nuisances sonores des travaux",
    "Odeur désagréable dans la chambre",
    "Lit inconfortable",
    "Télévision ne fonctionne pas",
    "Minibar vide à l'arrivée",
    "Serviettes sales dans la salle de bain",
  ];

  const complaintStatuses: ComplaintStatus[] = [
    ComplaintStatus.OPEN,
    ComplaintStatus.IN_PROGRESS,
    ComplaintStatus.RESOLVED,
    ComplaintStatus.CLOSED,
  ];

  const complaintPriorities: ComplaintPriority[] = [
    ComplaintPriority.LOW,
    ComplaintPriority.MEDIUM,
    ComplaintPriority.HIGH,
    ComplaintPriority.URGENT,
  ];

  const complaints = [];
  
  // Récupérer toutes les assignations de réceptionnistes pour assigner les plaintes correctement
  const allReceptionistAssignments = await prisma.hotelReceptionist.findMany({
    include: {
      user: true,
      hotel: true,
    },
  });

  for (let i = 0; i < 18; i++) {
    // Sélectionner un hôtel aléatoire qui a un réceptionniste assigné
    const assignment = allReceptionistAssignments[Math.floor(Math.random() * allReceptionistAssignments.length)];
    const hotel = assignment.hotel;
    const receptionist = assignment.user;

    // 60% de chance d'être lié à une réservation
    let bookingId = null;
    if (Math.random() < 0.6) {
      const hotelBookings = bookings.filter(b => b.hotelId === hotel.id);
      if (hotelBookings.length > 0) {
        bookingId = hotelBookings[Math.floor(Math.random() * hotelBookings.length)].id;
      }
    }

    const status = complaintStatuses[Math.floor(Math.random() * complaintStatuses.length)];
    const priority = complaintPriorities[Math.floor(Math.random() * complaintPriorities.length)];
    const title = complaintTitles[i % complaintTitles.length];

    // Générer une résolution si le statut est RESOLVED ou CLOSED
    let resolution = null;
    let resolvedAt = null;
    if (status === ComplaintStatus.RESOLVED || status === ComplaintStatus.CLOSED) {
      resolution = `Problème résolu. ${title.includes("climatisation") ? "Le système de climatisation a été réparé." : title.includes("WiFi") ? "Le routeur a été redémarré et le problème est résolu." : title.includes("propreté") ? "La chambre a été nettoyée de nouveau et inspectée." : "Nous avons pris les mesures nécessaires pour résoudre ce problème."}`;
      resolvedAt = new Date(Date.now() - Math.floor(Math.random() * 5) * 24 * 60 * 60 * 1000); // Résolu dans les 5 derniers jours
    }

    const complaint = await prisma.complaint.create({
      data: {
        hotelId: hotel.id,
        bookingId,
        userId: receptionist.id,
        guestName: `Client ${i + 1}`,
        guestEmail: Math.random() < 0.7 ? `client${i + 1}@example.com` : null,
        guestPhone: Math.random() < 0.8 ? `+243 900 ${String(800 + i).padStart(3, "0")} ${String(i + 1).padStart(3, "0")}` : null,
        title,
        description: `Description détaillée de la plainte: ${title}. Le client a signalé ce problème et demande une intervention rapide.`,
        status,
        priority,
        resolution,
        resolvedAt,
      },
    });

    complaints.push(complaint);
  }

  console.log(`✅ Complaints created: ${complaints.length}`);

  // 13.6. Créer des Notifications pour les utilisateurs
  const notificationTypes: NotificationType[] = [
    NotificationType.BOOKING_CONFIRMED,
    NotificationType.BOOKING_CANCELLED,
    NotificationType.PAYMENT_RECEIVED,
    NotificationType.REVIEW_POSTED,
    NotificationType.PROMOTION_AVAILABLE,
    NotificationType.SYSTEM_ALERT,
  ];

  const notificationChannels: NotificationChannel[] = [
    NotificationChannel.IN_APP,
    NotificationChannel.EMAIL,
    NotificationChannel.SMS,
  ];

  const notifications = [];
  for (const user of [...users, ...subscribers]) {
    // Créer 2-4 notifications par utilisateur
    const notifCount = Math.floor(Math.random() * 3) + 2;
    
    for (let i = 0; i < notifCount; i++) {
      const type = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
      const channel = notificationChannels[Math.floor(Math.random() * notificationChannels.length)];
      const isRead = Math.random() < 0.6; // 60% lues
      
      let title = "";
      let message = "";
      let link = null;

      switch (type) {
        case NotificationType.BOOKING_CONFIRMED:
          title = "Réservation confirmée";
          message = "Votre réservation a été confirmée avec succès.";
          link = "/dashboard?tab=bookings";
          break;
        case NotificationType.PAYMENT_RECEIVED:
          title = "Paiement reçu";
          message = "Nous avons bien reçu votre paiement.";
          link = "/dashboard?tab=bookings";
          break;
        case NotificationType.PROMOTION_AVAILABLE:
          title = "Promotion disponible";
          message = "Une nouvelle promotion est disponible : -20% ce week-end !";
          link = "/hotels";
          break;
        case NotificationType.SYSTEM_ALERT:
          title = "Mise à jour système";
          message = "Nouvelle fonctionnalité disponible sur la plateforme.";
          break;
        default:
          title = "Notification";
          message = "Vous avez une nouvelle notification.";
      }

      const notification = await prisma.notification.create({
        data: {
          userId: user.id,
          type,
          channel,
          title,
          message,
          link,
          read: isRead,
          readAt: isRead ? new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000) : null,
          sentAt: new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000),
        },
      });
      notifications.push(notification);
    }
  }
  console.log(`✅ Notifications created: ${notifications.length}`);

  // 13.7. Créer des ActivityLogs pour l'audit
  const activityTypes: ActivityType[] = [
    ActivityType.USER_LOGIN,
    ActivityType.USER_REGISTER,
    ActivityType.BOOKING_CREATED,
    ActivityType.BOOKING_CANCELLED,
    ActivityType.BOOKING_MODIFIED,
    ActivityType.PAYMENT_PROCESSED,
    ActivityType.REVIEW_CREATED,
    ActivityType.HOTEL_CREATED,
    ActivityType.HOTEL_UPDATED,
    ActivityType.SETTINGS_UPDATED,
  ];

  const activityLogs = [];
  
  // Logs pour les bookings
  for (const booking of bookings.slice(0, 15)) {
    await prisma.activityLog.create({
      data: {
        userId: booking.userId,
        type: ActivityType.BOOKING_CREATED,
        entityType: "Booking",
        entityId: booking.id,
        description: `Réservation créée pour ${booking.guestName}`,
        ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        createdAt: booking.createdAt,
      },
    });
    activityLogs.push(true);
  }

  // Logs pour les hotels
  for (const hotel of allHotels.slice(0, 8)) {
    const manager = await prisma.hotelManager.findFirst({
      where: { hotelId: hotel.id },
    });
    
    if (manager) {
      await prisma.activityLog.create({
        data: {
          userId: manager.userId,
          type: ActivityType.HOTEL_CREATED,
          entityType: "Hotel",
          entityId: hotel.id,
          description: `Hôtel ${hotel.name} créé`,
          ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
          userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      });
      activityLogs.push(true);
    }
  }

  // Logs pour les users (connexions)
  for (const user of [...users, ...subscribers].slice(0, 10)) {
    const loginCount = Math.floor(Math.random() * 5) + 1;
    for (let i = 0; i < loginCount; i++) {
      await prisma.activityLog.create({
        data: {
          userId: user.id,
          type: ActivityType.USER_LOGIN,
          entityType: "User",
          entityId: user.id,
          description: `Connexion de l'utilisateur ${user.name}`,
          ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
          userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
        },
      });
      activityLogs.push(true);
    }
  }

  console.log(`✅ Activity Logs created: ${activityLogs.length}`);

  // 13.8. Créer des BookingModifications
  const bookingModifications = [];
  
  // Modifier 30% des réservations
  for (const booking of bookings.slice(0, 8)) {
    if (Math.random() < 0.3) {
      // Modification de statut
      await prisma.bookingModification.create({
        data: {
          bookingId: booking.id,
          modifiedBy: booking.userId,
          changeType: "status",
          oldValue: { status: "PENDING" },
          newValue: { status: booking.status },
          reason: "Changement de statut après paiement",
        },
      });
      bookingModifications.push(true);

      // 50% ont aussi une modification de date
      if (Math.random() < 0.5) {
        const oldDate = new Date(booking.date);
        oldDate.setDate(oldDate.getDate() - 2);
        
        await prisma.bookingModification.create({
          data: {
            bookingId: booking.id,
            modifiedBy: booking.userId,
            changeType: "date",
            oldValue: { date: oldDate.toISOString() },
            newValue: { date: booking.date.toISOString() },
            reason: "Changement de dates demandé par le client",
          },
        });
        bookingModifications.push(true);
      }
    }
  }

  console.log(`✅ Booking Modifications created: ${bookingModifications.length}`);

  // 14. Mettre à jour hotelCount dans City
  await prisma.city.update({
    where: { id: city.id },
    data: { hotelCount: allHotels.length },
  });

  console.log("✅ City hotelCount updated");

  console.log("\n🎉 Seeding completed successfully!");
  console.log("\n📊 Summary:");
  console.log(`   - ${users.length + subscribers.length + groupManagers.length + allManagers.length + receptionists.length + admins.length + superAdmins.length} Users`);
  console.log(`   - ${partners.length} Partners with Settings`);
  console.log(`   - ${hotelGroups.length} Hotel Groups`);
  console.log(`   - ${groupManagerAssignments.length} Hotel Group Manager Assignments`);
  console.log(`   - ${allHotels.length} Hotels`);
  console.log(`   - ${receptionistAssignmentCount} Receptionist Assignments`);
  console.log(`   - ${allRoomTypes.length} RoomTypes`);
  console.log(`   - ${roomOptionCount} Room Options`);
  console.log(`   - ${timeSlots.length} TimeSlots (including 'Location classique')`);
  console.log(`   - ${pricingRuleCount} Pricing Rules`);
  console.log(`   - ${availabilityCount} Availabilities`);
  console.log(`   - ${bookings.length} Bookings`);
  console.log(`   - ${bookingOptionCount} Booking Options`);
  console.log(`   - ${completedBookings.length} Reviews`);
  console.log(`   - ${promotions.length} Promotions`);
  console.log(`   - ${promotionUsageCount} Promotion Usages`);
  console.log(`   - ${complaints.length} Complaints`);
  console.log(`   - ${notifications.length} Notifications`);
  console.log(`   - ${activityLogs.length} Activity Logs`);
  console.log(`   - ${bookingModifications.length} Booking Modifications`);
  console.log("\n✅ ALL MODELS SEEDED - Database is fully populated!");
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
