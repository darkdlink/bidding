<?php 

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Proposta extends Model
{
    use HasFactory;

    protected $fillable = [
        'licitacao_id',
        'usuario_id',
        'valor_proposto',
        'detalhes',
        'status',
        'data_envio'
    ];

    protected $casts = [
        'data_envio' => 'date',
        'valor_proposto' => 'decimal:2'
    ];

    public function licitacao()
    {
        return $this->belongsTo(Licitacao::class);
    }

    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    public function itens()
    {
        return $this->hasMany(ItemProposta::class, 'proposta_id');
    }
}
