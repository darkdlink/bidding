<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ItemProposta extends Model
{
    use HasFactory;

    protected $table = 'itens_proposta';

    protected $fillable = [
        'proposta_id',
        'descricao',
        'quantidade',
        'unidade',
        'valor_unitario',
        'valor_total'
    ];

    protected $casts = [
        'quantidade' => 'decimal:2',
        'valor_unitario' => 'decimal:2',
        'valor_total' => 'decimal:2'
    ];

    public function proposta()
    {
        return $this->belongsTo(Proposta::class);
    }
}