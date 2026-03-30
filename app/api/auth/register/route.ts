import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      password,
      phone,
      role,
      businessName,
      address,
      city,
      state,
      pincode,
      cuisineType,
    } = body;

    // Validation
    if (!email || !password || !name || !phone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 },
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user within a transaction
    const user = await prisma.$transaction(async (tx) => {
      // Create user
      const newUser = await tx.user.create({
        data: {
          email,
          name,
          firstName: name.split(" ")[0],
          lastName: name.split(" ").slice(1).join(" "),
          password: hashedPassword,
          phone,
          role: role === "VENDOR" ? "VENDOR" : "CONSUMER",
        },
      });

      // If vendor, create vendor profile
      if (role === "VENDOR") {
        if (
          !businessName ||
          !address ||
          !city ||
          !state ||
          !pincode ||
          !cuisineType
        ) {
          throw new Error("Missing vendor details");
        }

        await tx.vendor.create({
          data: {
            userId: newUser.id,
            businessName,
            description: `Welcome to ${businessName}! We serve ${cuisineType} cuisine.`,
            address,
            city,
            state,
            pincode,
            phone,
            cuisineType,
            isPureVeg: false,
            dailyCapacity: 100,
            isActive: true,
          },
        });
      }

      return newUser;
    });

    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
