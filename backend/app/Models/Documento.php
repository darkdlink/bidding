<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Documento extends Model
{
    use HasFactory;

    protected $fillable = [
        'licitacao_id',
        'nome',
        'tipo',
        'caminho',
        'mime_type',
        'tamanho'
    ];

    public function licitacao()
    {
        return $this->belongsTo(Licitacao::class);
    }
}