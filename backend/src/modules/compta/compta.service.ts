import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Between } from 'typeorm'
import { ComptaEntree } from './compta.entity'

@Injectable()
export class ComptaService {
  constructor(@InjectRepository(ComptaEntree) private repo: Repository<ComptaEntree>) {}

  findAll() { return this.repo.find({ relations:['user'], order:{ date:'DESC', created_at:'DESC' } }) }

  findByMonth(year: number, month: number) {
    const from = `${year}-${String(month).padStart(2,'0')}-01`
    const to   = `${year}-${String(month).padStart(2,'0')}-31`
    return this.repo.find({
      where: { date: Between(from, to) as any },
      relations: ['user'],
      order: { date:'DESC' },
    })
  }

  async stats(year: number) {
    const all = await this.repo.find({ where: { created_at: Between(new Date(`${year}-01-01`), new Date(`${year}-12-31`)) as any } })
    const months = Array.from({length:12}, (_,i) => {
      const m = i + 1
      const entrees = all.filter(e => new Date(e.date).getMonth()+1 === m)
      const recettes = entrees.filter(e => e.type==='recette').reduce((s,e) => s + parseFloat(String(e.montant)), 0)
      const depenses = entrees.filter(e => e.type==='depense').reduce((s,e) => s + parseFloat(String(e.montant)), 0)
      return { mois:m, recettes: +recettes.toFixed(2), depenses: +depenses.toFixed(2), net: +(recettes-depenses).toFixed(2) }
    })
    const totalRecettes = months.reduce((s,m) => s+m.recettes, 0)
    const totalDepenses = months.reduce((s,m) => s+m.depenses, 0)
    return { months, totalRecettes: +totalRecettes.toFixed(2), totalDepenses: +totalDepenses.toFixed(2), net: +(totalRecettes-totalDepenses).toFixed(2) }
  }

  create(dto: Partial<ComptaEntree>) { return this.repo.save(this.repo.create(dto)) }
  update(id: number, dto: Partial<ComptaEntree>) { return this.repo.update(id, dto).then(() => this.repo.findOne({ where:{id} })) }
  remove(id: number) { return this.repo.delete(id) }
}