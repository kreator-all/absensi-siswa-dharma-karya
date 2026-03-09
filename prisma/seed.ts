import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: adminPassword,
      name: 'Administrator',
      role: 'admin',
      isActive: true
    }
  })

  console.log('Created admin user:', admin.username)

  // Create sample announcements
  const announcements = await Promise.all([
    prisma.announcement.create({
      data: {
        title: 'Selamat Datang di Sistem Absensi',
        content: 'Selamat datang di Sistem Absensi Siswa Sekolah Dharma Karya Pondok Cabe. Silakan lakukan registrasi terlebih dahulu jika Anda siswa baru, kemudian daftarkan wajah dan sidik jari Anda di menu Pengaturan.',
        authorId: admin.id,
        isActive: true
      }
    }),
    prisma.announcement.create({
      data: {
        title: 'Jam Absensi',
        content: 'Absensi masuk tersedia dari pukul 06:00 - 12:00. Absensi keluar tersedia dari pukul 12:00 - 18:00. Pastikan Anda melakukan absensi tepat waktu.',
        authorId: admin.id,
        isActive: true
      }
    }),
    prisma.announcement.create({
      data: {
        title: 'Pengajuan Izin dan Sakit',
        content: 'Bagi siswa yang tidak dapat hadir, silakan ajukan permohonan izin atau sakit melalui menu Perizinan. Lampirkan surat keterangan jika diperlukan.',
        authorId: admin.id,
        isActive: true
      }
    })
  ])

  console.log('Created', announcements.length, 'announcements')

  console.log('Seed completed!')
  console.log('\nLogin credentials:')
  console.log('Username: admin')
  console.log('Password: admin123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
