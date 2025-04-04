<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Entidade extends Model
{
    use HasFactory;

    protected $fillable = [
        'nome',
        'cnpj',
        'tipo',
        'esfera'
    ];

    public function licitacoes()
    {
        return $this->hasMany(Licitacao::class);
    }
}