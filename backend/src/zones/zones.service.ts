import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Zone } from './zone.entity';
import { CreateZoneDto } from './dto/create-zone.dto';
import { UpdateZoneDto } from './dto/update-zone.dto';

@Injectable()
export class ZonesService implements OnModuleInit {
  constructor(
    @InjectRepository(Zone)
    private readonly zonesRepository: Repository<Zone>,
  ) {}

  async onModuleInit() {
    await this.seedDefaultZones();
  }

  private async seedDefaultZones(): Promise<void> {
    // Liste de zones par défaut pour Antananarivo afin d'avoir
    // une base complète sans création manuelle dans l'interface.
    const defaultZones: Array<Pick<Zone, 'city' | 'name' | 'isActive'>> = [
      { city: 'Antananarivo', name: 'Anosy', isActive: true },
      { city: 'Antananarivo', name: 'Ambanidia', isActive: true },
      { city: 'Antananarivo', name: 'Ambohijatovo', isActive: true },
      { city: 'Antananarivo', name: 'Ampasanimalo', isActive: true },
      { city: 'Antananarivo', name: 'Analakely', isActive: true },
      { city: 'Antananarivo', name: 'Andohalo', isActive: true },
      { city: 'Antananarivo', name: 'Ankadifotsy', isActive: true },
      { city: 'Antananarivo', name: 'Ankadikely', isActive: true },
      { city: 'Antananarivo', name: 'Ankazomanga', isActive: true },
      { city: 'Antananarivo', name: 'Andraharo', isActive: true },
      { city: 'Antananarivo', name: 'Ankorondrano', isActive: true },
      { city: 'Antananarivo', name: 'Ivandry', isActive: true },
      { city: 'Antananarivo', name: 'Andoharanofotsy', isActive: true },
      { city: 'Antananarivo', name: 'Ambohijanaka', isActive: true },
      { city: 'Antananarivo', name: 'Alasora', isActive: true },
      { city: 'Antananarivo', name: 'Ambohibao', isActive: true },
      { city: 'Antananarivo', name: 'Andranomena', isActive: true },
      { city: 'Antananarivo', name: 'Ankadifotsy Atsimo', isActive: true },
      { city: 'Antananarivo', name: 'Ambohitrimanjaka', isActive: true },
      { city: 'Antananarivo', name: 'Sabotsy Namehana', isActive: true },
      { city: 'Antananarivo', name: 'Ambohimangakely', isActive: true },
      { city: 'Antananarivo', name: 'Anosizato', isActive: true },
      { city: 'Antananarivo', name: 'Andranonahoatra', isActive: true },
      { city: 'Antananarivo', name: 'Soanierana', isActive: true },
      { city: 'Antananarivo', name: '67 Ha', isActive: true },
      { city: 'Antananarivo', name: 'Isotry', isActive: true },
      { city: 'Antananarivo', name: 'Mahamasina', isActive: true },
      { city: 'Antananarivo', name: 'Anosibe', isActive: true },
      { city: 'Antananarivo', name: 'Anjezika', isActive: true },
      { city: 'Antananarivo', name: 'Itaosy', isActive: true },
    ];

    const beforeCount = await this.zonesRepository.count();
    let created = 0;

    for (const z of defaultZones) {
      const exists = await this.zonesRepository.findOne({
        where: { city: z.city, name: z.name },
      });
      if (!exists) {
        const zone = this.zonesRepository.create(z);
        await this.zonesRepository.save(zone);
        created++;
      }
    }

    // eslint-disable-next-line no-console
    console.log(
      `Zones seeding: ${created} nouvelle(s) zone(s) créée(s), total existant avant = ${beforeCount}`,
    );
  }

  findAllActive(): Promise<Zone[]> {
    // Zones publiques : on renvoie toutes les zones existantes, triées,
    // pour que les filtres et le formulaire d'abonnement voient
    // aussi les zones insérées directement dans la base.
    return this.zonesRepository.find({
      order: { city: 'ASC', name: 'ASC' },
    });
  }

  findAll(): Promise<Zone[]> {
    return this.zonesRepository.find();
  }

  async findById(id: number): Promise<Zone> {
    const zone = await this.zonesRepository.findOne({ where: { id } });
    if (!zone) {
      throw new NotFoundException('Zone not found');
    }
    return zone;
  }

  async create(dto: CreateZoneDto): Promise<Zone> {
    const zone = this.zonesRepository.create({
      name: dto.name,
      city: dto.city,
      isActive: dto.isActive ?? true,
    });
    return this.zonesRepository.save(zone);
  }

  async update(id: number, dto: UpdateZoneDto): Promise<Zone> {
    const zone = await this.findById(id);
    Object.assign(zone, dto);
    return this.zonesRepository.save(zone);
  }

  async remove(id: number): Promise<void> {
    await this.zonesRepository.delete(id);
  }
}
