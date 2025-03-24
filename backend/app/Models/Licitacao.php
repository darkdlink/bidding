<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Licitacao extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'licitacoes';

    protected $fillable = [
        'numero_edital',
        'titulo',
        'descricao',
        'entidade_id',
        'modalidade',
        'valor_estimado',
        'data_publicacao',
        'data_abertura',
        'data_encerramento',
        'status'
    ];

    protected $casts = [
        'data_publicacao' => 'date',
        'data_abertura' => 'date',
        'data_encerramento' => 'date',
        'valor_estimado' => 'decimal:2'
    ];

    public function entidade()
    {
        return $this->belongsTo(Entidade::class);
    }

    public function documentos()
    {
        return $this->hasMany(Documento::class);
    }

    public function propostas()
    {
        return $this->hasMany(Proposta::class);
    }

    public function atividades()
    {
        return $this->hasMany(Atividade::class);
    }
}