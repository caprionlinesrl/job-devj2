<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\DBAL\Connection;
use Symfony\Component\HttpFoundation\Request;

class MoviesController extends AbstractController
{
    #[Route('/api/movies')]
    public function list(Request $request, Connection $db): Response
    {
        $queryBuilder = $db->createQueryBuilder()
            ->select("m.*")
            ->from("movies", "m")
            ->orderBy("m.release_date", "DESC")
            ->addOrderBy("m.rating", "DESC");
        // Legge il parametro di query "type" dalla richiesta
        $genre = $request->query->get('genre');
      if ($genre) {
         $queryBuilder
      ->select('m.*, g.value as genre')
            ->leftJoin('m', 'movies_genres', 'mg', 'm.id = mg.movie_id')
            ->leftJoin('mg', 'genres', 'g', 'mg.genre_id = g.id')
            ->andWhere('g.id = :type')
            ->setParameter('type', $genre);
      }
        $rows = $queryBuilder
            ->executeQuery()
            ->fetchAllAssociative();

        return $this->json([
            "movies" => $rows
        ]);
    }
}
