<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Atividade extends Model
{
    use HasFactory;

    protected $fillable = [
        'licitacao_id',
        'usuario_id',
        'tipo',
        'descricao'
    ];

    public function licitacao()
    {
        return $this->belongsTo(Licitacao::class);
    }

    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }
}